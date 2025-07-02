import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { selectLineFromText } from "../general/selectLineFromText.mjs";
import { isPngFile, isImageFile } from "../general/fileTypeTests.mjs";

/**
 * Loop through list of files with name and path
 * Copy image file to new directory
 * Convert / process png if needed
 * Rename with dimensions/ lowercase etc.
 * Return array of new file names with paths
 * @param {string[]} fileListFullPath
 * @param {boolean} shouldMakeEven
 * @returns {Promise<{newFileList: string[], backupList: string[]}>}
 */
export async function renameFiles(fileListFullPath,shouldMakeEven = false) {
  try {
    const newFileList = [];
    const pngStrategy = fileListFullPath.some(
      (item) => item.indexOf("png") !== -1
    )
      ? await selectLineFromText(["keep", "convert", "both"])
      : "keep";
    for (const file of fileListFullPath) {
      const isImage = isImageFile(file);
      if (isImage) {
        const isPng = isPngFile(file);
        const movedFile = await processAndCopyFile(file, isPng, pngStrategy,shouldMakeEven);
        for (const file of movedFile) {
          const newFileName = await fileNameDimensions(file);
          newFileList.push(newFileName);
          await fs.rename(file, newFileName);
        }
      }
    }
    return { newFileList };
  } catch (error) {
    console.log("Error renaming", error);
    throw error;
  }
}

/**
 * Take in filename with path
 * Create 'processed' directory (if does not exist)
 * Copy files to 'processed' directory
 * @param {string[]} fileListFullPath
 * @returns {Promise<string>}
 */
export async function copyFileToSubFolder(
  fileFullPath,
  folderName = "processed"
) {
  const pathName = path.dirname(fileFullPath);
  const baseName = path.basename(fileFullPath);
  const origin = fileFullPath;
  const newPath = path.join(pathName, folderName);
  const destination = path.join(newPath, baseName);
  try {
    await fs.access(newPath);
  } catch (error) {
    await fs.mkdir(newPath);
  }
  try {
    await fs.copyFile(origin, destination);
  } catch (error) {
    console.log("error copying file:", error);
  }
  return destination;
}
/**
 * Take in filename with path
 * Copy files to 'processed' directory
 * Convert PNG to JPG and delete PNG as needed
 * @param {string} fileFullPath
 * @param {boolean} isPng
 * @param {string} pngStrategy
 * @param {boolean} shouldMakeEven
 * @returns {Promise<string[]>}
 */
async function processAndCopyFile(
  fileFullPath,
  isPng,
  pngStrategy,
  shouldMakeEven = false
) {
  shouldMakeEven && await makeImageEven(fileFullPath);
  const workingFile = await copyFileToNewFolder(fileFullPath);
  if (!isPng || pngStrategy === "keep") return [workingFile];
  const shouldDelete = pngStrategy === "convert";
  return await convertPngToJpg(workingFile, shouldDelete);
}

/**
 * Take in filename with path
 * Create 'processed' directory (if does not exist)
 * Copy files to 'processed' directory
 * @param {string[]} fileListFullPath
 * @param {string[]} destinationDirName
 * @returns {Promise<string>}
 */
export async function copyFileToNewFolder(fileFullPath, destinationDirName) {
  const origin = fileFullPath;
  const baseName = path.basename(fileFullPath);
  const destination = path.join(destinationDirName, baseName);
  try {
    await fs.access(destinationDirName);
  } catch (error) {
    await fs.mkdir(destinationDirName);
  }
  try {
    await fs.copyFile(origin, destination);
  } catch (error) {
    console.log("error copying file:", error);
  }
  return destination;
}
/**
 * Take in file with full path
 * Convert from PNG to JPG
 * Delete the original JPG
 * @param {string} file
 * @param {boolean} shouldDeletePng
 * @returns {Promise<string[]>}
 */
async function convertPngToJpg(file, shouldDeletePng = true) {
  try {
    // Extract the directory path and filename without extension
    const dirPath = path.dirname(file);
    const fileNameWithoutExt = path.basename(file, ".png");

    if (!shouldDeletePng) {
      await cropImageToContent(file);
    }
    // Create the output JPG filename
    const jpgFilePath = path.join(dirPath, `${fileNameWithoutExt}.jpg`);

    // Convert PNG to JPG
    await sharp(file).jpeg({ quality: 80 }).toFile(jpgFilePath);

    //console.log(`Converted ${file} to JPG: ${jpgFilePath}`);

    // Delete the original PNG file
    if (shouldDeletePng) {
      await fs.unlink(file);
      //console.log(`Deleted original PNG file: ${file}`);
    }

    return shouldDeletePng ? [jpgFilePath] : [jpgFilePath, file];
  } catch (error) {
    console.error(`Error converting ${file}:`, error);
    throw error; // Re-throw the error so it can be caught by the caller
  }
}

/**
 * Take filename with full path
 * Return component parts
 * @param {string} fileNameFullPath
 * @returns {string}
 */
function fullPathNameSplitter(fileNameFullPath) {
  const pathName = path.dirname(fileNameFullPath);
  const baseName = path.basename(fileNameFullPath);
  const extName = path.extname(fileNameFullPath);
  const baseNameNoExt = path.basename(
    fileNameFullPath,
    path.extname(fileNameFullPath)
  );
  return { pathName, baseName, baseNameNoExt, extName };
}

/**
 * Take filename with full path
 * Cleanup filename
 * Add image dimensions
 * @param {string} fileNameFullPath
 * @returns {Promise<string>}
 */
export async function fileNameDimensions(fileNameFullPath) {
  try {
    const { width, height } = await getImageDimensions(fileNameFullPath);
    const { pathName, baseNameNoExt, extName } =
      fullPathNameSplitter(fileNameFullPath);
    const newFileName = `${processFilename(
      baseNameNoExt
    )}_${width}_${height}${extName}`;
    const newNameFullPath = path.join(pathName, newFileName);
    return newNameFullPath;
  } catch (error) {
    console.error(`Error processing ${fileNameFullPath}:`, error);
  }
}
/**
 * Take filename with full path
 * Cleanup filename
 *  * @param {string} fileNameFullPath
 * @returns {string}
 */
function processFilename(filename) {
  const cleanedName = filename
    .replaceAll(/[-\s]+/g, "-")
    .replace(/(\_[\d]+)+$/g, "")
    .toLowerCase();
  //console.log('cleanedName:', cleanedName);
  return moveBreakpointToFilenameEnd(cleanedName).replaceAll(/[_-]+/g, "-");
}
/**
 * Take cleaned filename
 * Move breakpoint name to end of filename
 *  * @param {string} fileNameFullPath
 * @returns {string}
 */
function moveBreakpointToFilenameEnd(filename) {
  const breakpointMatch = filename.match(
    /([\-]?mobile)|([\-]?tablet)|([\-]?desktop)|([\-]?phone)|([\-]?phablet)/
  );
  const breakpoint = breakpointMatch ? breakpointMatch[0] : undefined;
  //console.log('breakpoint:', breakpoint);
  return breakpoint
    ? `${filename.replace(breakpoint, "").replace(/^\-/, "")}-${breakpoint}`
    : filename;
}
/**
 *
 * @param {string} fileNameFullPath
 * @returns {Promise<{[key:string]:string}>}
 */
export async function getImageDimensions(fileNameFullPath) {
  const sharpInstance = sharp(fileNameFullPath);
  const metadata = await sharpInstance.metadata();
  const { width, height } = metadata;
  return { width, height };
}
export async function getEvenImageDimensions(fileNameFullPath) {
  const sharpInstance = sharp(fileNameFullPath);
  const metadata = await sharpInstance.metadata();
  const { width, height } = metadata;
  const widthEven = width % 2 === 0 ? width : width - 1;
  const heightEven = height % 2 === 0 ? height : height - 1;
  const shouldCrop = width !== widthEven || height !== heightEven;
  return { width: widthEven, height: heightEven, shouldCrop };
}

async function cropImageToContent(inputPath) {
  const tempPath = appendFilename(inputPath, "old");
  //console.log('tempPath:', tempPath);
  // rename old file
  await fs.rename(inputPath, tempPath);
  // trim
  await sharp(tempPath).trim().toFile(inputPath);
  // delete old file
  await fs.unlink(tempPath);
}
/**
 *
 * @param {string} filename
 * @param {string} appendString
 * @returns {string}
 */
function appendFilename(filename, appendString) {
  const { pathName, baseNameNoExt, extName } = fullPathNameSplitter(filename);
  const newPath = `${pathName}${baseNameNoExt}${appendString}${extName}`;
  return newPath;
}
export async function makeImageEven(file) {
  const { width, height, shouldCrop } = await getEvenImageDimensions(file);
  shouldCrop && (await cropInputFrame(file, width, height));
}
