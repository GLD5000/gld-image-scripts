import * as fs from "fs";
import * as fsAsync from "fs/promises";
import path from "path";
import * as readline from "node:readline/promises";
// import * as readline from "readline";
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
  return getFileListFullPath(inputPath).filter((file) => isFolder(file));
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
  try {
    const rl = getReadLine();
    if (inputPath) {
      rl.close();
      const fileList = getFileList(inputPath);
      return { fileList, inputPath };
    }
    let dirPath = await rl.question("Please enter the directory path: ");
    try {
      console.log("dirPath", dirPath);
      if ( !dirPath.trim()) {
        const err = new Error("Please enter a value");
        console.error("Input should not be blank.", err);
        rl.close(); // Close the readline interface after operation
        return err;
      }
      const fileList = getFileList(dirPath);
      return { fileList, inputPath: dirPath };
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      return JSON.stringify(error);
    } finally {
      rl.close(); // Close the readline interface after operation
    }
  } catch (error) {
    console.log("error", error);
    return JSON.stringify(error);
  }
}
/**
 * Gives a list of files (full path) for a given path from user prompt or function input
 *
 * @param {string | undefined} inputPath
 * @returns {Promise<{fileList: string[], inputPath: string}>}
 */
export async function listFileFullPaths(inputPath) {
  try {
    const rl = getReadLine();
    if (inputPath) {
      rl.close();

      return {
        fileList: getFileListFullPath(inputPath),
        inputPath,
      };
    }
    let dirPath = await rl.question("Please enter the directory path: ");
    try {
      console.log("dirPath", dirPath);
      if ( !dirPath.trim()) {
        const err = new Error("Please enter a value");
        console.error("Input should not be blank.", err);
        rl.close(); // Close the readline interface after operation
        return err;
      }
      return {
        fileList: getFileListFullPath(dirPath),
        inputPath: dirPath,
      };
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      return JSON.stringify(error);
    } finally {
      rl.close(); // Close the readline interface after operation
    }
  } catch (error) {
    return JSON.stringify(error);
  }
}
/**
 * Gives an array of lists of files (full path) for a given path's subfolders
 *
 * @param {string | undefined} inputPath
 * @returns {Promise<{fileList: string[], inputPath: string}>}
 */
export async function listFileFullPathsMulti(inputPath = undefined) {
  try {
    const rl = getReadLine();
    if (inputPath) {
      console.log("inputPath", inputPath);
      rl.close();
      return await getSubfolderArrays(inputPath);
    }
    let dirPath = await rl.question("Please enter the directory path: ");
    try {
      console.log("dirPath", dirPath);
      if (!! !dirPath.trim()) {
        const err = new Error("Please enter a value");
        console.error("Input should not be blank.", err);
        rl.close(); // Close the readline interface after operation
        return err;
      }
      return await getSubfolderArrays(dirPath);
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      return JSON.stringify(error);
    } finally {
      rl.close(); // Close the readline interface after operation
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify(error);
  }
}
function getReadLine() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}
async function getSubfolderArrays(inputPath) {
  const folderList = getFolderList(inputPath);
  const fileLists = [];
  for (let i in folderList) {
    console.log("folderList[i]", folderList[i]);

    fileLists.push(await listFileFullPaths(folderList[i]));
  }
  return {
    fileLists,
    inputPath,
  };
}
/**
 * Take in filename with path
 * Create 'processed' directory (if does not exist)
 * return target filename with path
 * @param {string} fileFullPath
 * @param {{suffix: string; extension: string; folders: string[]|undefined; fileName: string|undefined}} options
 * @returns {Promise<string>}
 */
export async function getTargetPath(fileFullPath, options) {
  const {
    suffix = "",
    extension = "webp",
    folders = undefined,
    fileName = undefined,
  } = options || {};
  const pathName = path.dirname(fileFullPath);
  const baseNameNoExt = fileName || path.basename(fileFullPath).split(".")[0];
  const baseName = `${baseNameNoExt}${suffix}.${extension}`;
  const newPath =
    folders && folders.length
      ? await addFoldersToPath(pathName, folders)
      : pathName;
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
 * @param {string} pathName
 * @param {string} folder
 * @returns {promise<string>}
 */
export async function addFoldersToPath(pathName, folders) {
  let newPath = pathName;
  for (let i in folders) {
    newPath = await addFolderToPath(newPath, folders[i]);
  }

  return newPath;
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
