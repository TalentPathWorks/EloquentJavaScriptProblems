/**
 * Name: Roberto Sanchez
 * Jul 22, 2019
 * Chapter 05 - Higher Order Functions Problems
 */

 /**
  * Flattening
  * Use the reduce method in combination with the concat method to "flatten" an 
  * array of arrays into a single array that has all the elements of the original
  * arrays.
  * 
  */
 // Example
 const reducer = (accumulator, currentValue) =>accumulator.concat(currentValue)
 let arrays = [[1,2,3],[4,5],[6]];
 const flattenArray = arrays.reduce(reducer);
 console.log(`5-1: Flattening`);
 console.log(flattenArray)
 // -> [1,2,3,4,5,6]


 /**
  * Your own loop
  * Write a higher-order function loop that provides something like a for loop
  * statement. It takes a value, a test function, an update function, and a body
  * function. Each iteration, it first runs the test function on the current loop
  * value and stops if that returns false. Then it calls the body function, giving
  * it the current value. Finally, it calls the update function to create a new 
  * value and starts from the beginning.
  * 
  * When defining the function, you can use regular loop to do the actual looping.
  */
 
  function loop (start, endingFn, action,displayValue) {
    let i = start;
    for(i;endingFn(i);i = action(i)){
      displayValue(i);
    }
    /*
    // Another way
    while(endingFn(i)){
      displayValue(i);
      i = action(i);
    }
    */
  }
  console.log(`5-2: Your Own Loop:`)
  loop(3,n=>n>0,n=>n-1, console.log);
  //-> 3
  //-> 2
  //-> 1

/**
 * Everything
 * Analogous to the some method, arrays also have an every method. This one
 * returns true when the given function returns true for every element in the
 * array. In a way, some is a version of the || operator that acts on arrays, and
 * every is like the && operator.
 * 
 * Implement every as a function that takes an array and a predicate function as
 * parameters. Write two versions, one using a loop and one using the some method.
 */
function every(array, test) {
  if(array.length === 0)return true;
  
  return array.map(test).reduce((accumulator,currentValue)=> currentValue && accumulator)
};
// Not functional, needs more work
function every2(array,test){
  if(array.length === 0) return true;
  return array.map(test).some((element)=>{return element === true});
}
console.log(`5-3: Everything`)
console.log(every([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true
/**
 * Dominant writing direction
 * Write a function that computes the dominant writing direction in a string of
 * text. Remember that each script object has a direction property that can be
 * "ltr" (left to right), "rtl" (right to left), or "ttb" (top to bottom).
 * 
 *  The dominant direction is the direction of a majority of the characters that
 * have a script associated with them. The characterScript and countBy functions
 * defined earlier in the chapter are probably useful here.
 */
const SCRIPTS = require('./Scripts.js')

function characterScript(code) {
  for (let script of SCRIPTS) {
    if (script.ranges.some(([from, to]) => {
      return code >= from && code < to;
    })) {
      return script;
    }
  }
  return null;
}
function countBy(items, groupName) {
  let counts = [];
  for (let item of items) {
    let name = groupName(item);
    let known = counts.findIndex(c => c.name == name);
    if (known == -1) {
      counts.push({name, count: 1});
    } else {
      counts[known].count++;
    }
  }
  return counts;
}

function textScripts(text) {
  let scripts = countBy(text, char => {
    let script = characterScript(char.codePointAt(0));
    return script ? script.name : "none";
  }).filter(({name}) => name != "none");

  let total = scripts.reduce((n, {count}) => n + count, 0);
  if (total == 0) return "No scripts found";

  return scripts.map(({name, count}) => {
    return `${Math.round(count * 100 / total)}% ${name}`;
  }).join(", ");
}
/**
 * Gets the dominant direction
 * @param {String} text Any text
 */
function dominantDirection(text) {
  // Finds the language and returns
  return SCRIPTS.filter(item => item.name === dominantLanguage(text).trim())[0].direction
}

/**
 * 
 * @param {String} text Any string to determine the dominant language
 * @returns {String} Returns the dominant language
 */
function dominantLanguage(text){
  let result = textScripts(text).split(',').map(value => value.split('%'));

  if(result.length === 1) return result[0][1];
  // Pretty sure theres a better way
  let largest = [0,''];

  result.forEach((value)=>{
    if(parseInt(value[0],10) > parseInt(largest[0],10)){
      largest = value;
    }
  })
  return largest[1];
}
console.log(`5-4: Dominant Writting Direction `)
console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl