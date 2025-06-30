import * as fs from "fs";
import * as fsAsync from "fs/promises";
import path from "path";
import * as readline from "readline";
import { isFolder } from "./fileTypeTests.mjs";

/**
 * Get list of files from given path
 * @param {string} inputPath
 * @returns {string[]}
 */
function getFileList(inputPath) {
  return fs.readdirSync(inputPath);
}
/**
 * Get list of files from given path
 * @param {string} inputPath
 * @returns {string[]}
 */
function getFolderList(inputPath) {
  return getFileList(inputPath).filter((file) => isFolder(file));
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
      const folderList = getFolderList(inputPath);
      resolve({
        fileLists: folderList.map((folder) => listFileFullPaths(folder)),
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
        const folderList = getFolderList(inputPath);
        resolve({
          fileLists: folderList.map((folder) => listFileFullPaths(folder)),
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
 * Take in filename with path
 * Create 'processed' directory (if does not exist)
 * return target filename with path
 * @param {string} fileFullPath
 * @param {{suffix: string; extension: string; folder: string; subFolder: string|undefined; fileName: string|undefined}} options
 * @returns {Promise<string>}
 */
export async function getTargetPath(fileFullPath, options) {
  const {
    suffix = "",
    extension = "webp",
    folder = "processed",
    subFolder = undefined,
    fileName = undefined,
  } = options || {};
  console.log("fileFullPath:", fileFullPath);
  console.log(JSON.stringify(options));
  console.log(path.dirname(fileFullPath))
  const pathName = subFolder
    ? await addFolderToPath(path.dirname(fileFullPath), folder)
    : path.dirname(fileFullPath);
  console.log('pathName',fileFullPath)
  const baseNameNoExt = fileName || path.basename(fileFullPath).split(".")[0];
  const baseName = `${baseNameNoExt}${suffix}.${extension}`;
  const newPath = await addFolderToPath(
    pathName,
    subFolder ? subFolder : folder
  );
  const destination = path.join(newPath, baseName);
  return destination;
}
/**
 *
 * @param {string} pathName
 * @param {string} folder
 * @returns {promise<string>}
 */
export async function addFolderToPath(pathName, folder) {
  const newPath = path.join(pathName, folder);
  console.log('newPath',newPath)
  try {
    await fsAsync.access(newPath);
    return newPath;
  } catch (error) {
    await fsAsync.mkdir(newPath);
    return newPath;
  }
}

/**
 *
 * @param {string} fileFullPath
 * @returns  { {baseName:string; baseNameNoExtension:string; extension:string; dirName:string;} }
 */
export function getPathParts(fileFullPath) {
  const baseName = path.basename(fileFullPath);
  const dirName = path.dirname(fileFullPath);
  const [baseNameNoExtension, extension] = baseName.split(".");
  return { baseName, baseNameNoExtension, extension, dirName };
}
