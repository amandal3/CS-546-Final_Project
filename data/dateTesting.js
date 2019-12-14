/*
Author: @Besnik @Amanda
*/
var d = new Date(2019,11,12);
var e = new Date(2019,11,19);

let constNumb = 1000*60*60*24;
let diff = Math.abs(e-d);
let diff2 = Math.ceil(diff/constNumb)
console.log(diff2)
