import * as fs from "fs";
import path from "path";
import * as readline from "readline";

/**
 * Get list of files from given path
 * @param {string} inputPath
 * @returns {string[]}
 */
function getFileList(inputPath) {
  return fs.readdirSync(inputPath);
}
/**
 * Get list of files with paths from given path
 * @param {string} inputPath
 * @returns {string[]}
 */
function getFileListFullPath(inputPath) {
  const files = getFileList(inputPath);

  return files.map((fileName) => path.join(inputPath, fileName));
}

/**
 * Gives a list of filenames for a given path from user prompt or function input
 * @param {string | undefined} inputPath
 * @returns {Promise<{fileList: string[], inputPath: string}>}
 */
export async function listFileNames(inputPath) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (inputPath) {
      const fileList = getFileList(inputPath);
      resolve({ fileList, inputPath });
      rl.close();
    }

    rl.question("Please enter the directory path: ", (dirPath) => {
      if (!dirPath.trim()) {
        console.log(
          "Input should not be blank. Using current working directory."
        );
        dirPath = process.cwd(); // Set dirPath to the current working directory
      }

      try {
        const fileList = getFileList(dirPath);
        resolve({ fileList, inputPath: dirPath });
      } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        reject(error);
      } finally {
        rl.close(); // Close the readline interface after operation
      }
    });
  });
}
/**
 * Gives a list of files (full path) for a given path from user prompt or function input
 *
 * @param {string | undefined} inputPath
 * @returns {Promise<{fileList: string[], inputPath: string}>}
 */
export async function listFileFullPaths(inputPath) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (inputPath) {
      resolve({
        fileList: getFileListFullPath(inputPath),
        inputPath,
      });
      rl.close();
    }
    rl.question("Please enter the directory path: ", (dirPath) => {
      if (!dirPath.trim()) {
        console.error(
          "Input should not be blank. Using current working directory."
        );
        dirPath = process.cwd(); // Set dirPath to the current working directory
      }

      try {
        resolve({
          fileList: getFileListFullPath(dirPath),
          inputPath: dirPath,
        });
      } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        reject(error);
      } finally {
        rl.close(); // Close the readline interface after operation
      }
    });
  });
}
/**
 * Gives an array of lists of files (full path) for a given path's subfolders
 *
 * @param {string | undefined} inputPath
 * @returns {Promise<{fileList: string[], inputPath: string}>}
 */
export async function listFileFullPathsMulti(inputPath) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (inputPath) {
      resolve({
        fileList: getFileListFullPath(inputPath),
        inputPath,
      });
      rl.close();
    }
    rl.question("Please enter the directory path: ", (dirPath) => {
      if (!dirPath.trim()) {
        console.error(
          "Input should not be blank. Using current working directory."
        );
        dirPath = process.cwd(); // Set dirPath to the current working directory
      }

      try {
        resolve({
          fileList: getFileListFullPath(dirPath),
          inputPath: dirPath,
        });
      } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        reject(error);
      } finally {
        rl.close(); // Close the readline interface after operation
      }
    });
  });
}