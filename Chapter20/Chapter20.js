/**
 * Directory creation
 * Though the DELETE method in our file server is able to
 * delete directories (using rmdir), the server currently
 * does not provide any way to create a directory.
 * 
 * Add support for the MKCOL method (“make collection”), 
 * which should create a directory by calling mkdir from the 
 * fs module. MKCOL is not a widely used HTTP method, but it 
 * does exist for this same purpose in the WebDAV standard, 
 * which specifies a set of conventions on top of HTTP that 
 * make it suitable for creating documents.
 */
const fs = require("fs");

const {createServer} = require("http");

const methods = Object.create(null);
const PORT = 8000;

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request)
    .catch(error => {
      if (error.status != null) return error;
      return {body: String(error), status: 500};
    })
    .then(({body, status = 200, type = "text/plain"}) => {
       response.writeHead(status, {"Content-Type": type});
       if (body && body.pipe) body.pipe(response);
       else response.end(body);
    });
}).listen(PORT,()=>console.log(`Now listening on port: ${PORT}`));

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`
  };
}
const {parse} = require("url");
const {resolve, sep} = require("path");

const baseDirectory = process.cwd();

function urlPath(url) {
  let {pathname} = parse(url);
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory &&
      !path.startsWith(baseDirectory + sep)) {
    throw {status: 403, body: "Forbidden"};
  }
  return path;
}

const {createReadStream} = require("fs");
const {stat, readdir} = require("fs").promises;
const mime = require("mime");

methods.GET = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 404, body: "File not found"};
  }
  if (stats.isDirectory()) {
    return {body: (await readdir(path)).join("\n")};
  } else {
    return {body: createReadStream(path),
            type: mime.getType(path)};
  }
};
const {rmdir, unlink} = require("fs").promises;

methods.DELETE = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 204};
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return {status: 204};
};

methods.MKCOL = async function(request,response){
   
  try{
    await fs.access(request.url,fs.constants.F_OK,(err)=>{
      //Throws error if it alrady exists
      if(!err) {
        throw new Error(`Directory already Exists.`)
      }
    });
    await fs.promises.mkdir(`./${request.url}`,(err)=>{
      if(err)
        throw new Error(`Failed to make directory: ${err}`)
    });
    return {status: 201,body: String('Directory made.')}
  }catch(err){
    return {status: 500, body: String(`Something bad happended: ${err} `)}
  }
  
}