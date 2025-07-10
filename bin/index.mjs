import * as fs from "fs";
import { exec } from "child_process";

const argument = process.argv[2];
console.log('argument:', argument);
// if argument undefined run CLI menu
//Else select function
const packageJsonContent = fs.readFileSync('./package.json', 'utf8');
console.log('packageJsonContent:', packageJsonContent);