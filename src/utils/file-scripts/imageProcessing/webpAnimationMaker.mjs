import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import webp from "webp-converter";
import { getImageDimensions } from "../imageProcessing/imageEditing.mjs";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { webpmux_animateLocal } from "../../webp/webpConverterLocal.mjs";
import { isImageFile } from "../general/fileTypeTests.mjs";

/**
 * Loop through list of files with name and path
 * Create webp frames in new directory
 * Mux frames to animated webp
 * Return animated webp path string
 * @param {string[]} fileListFullPath
 * @returns {Promise<{newFileList: string[], backupList: string[]}>}
 */
export async function createWebPAnimation(fileListFullPath, parentDirectory) {
  // Validate inputs
  if (!Array.isArray(fileListFullPath) || fileListFullPath.length === 0) {
    throw new Error("Input files must be a non-empty array");
  }
  const outputArray = await makeWebpFrames(fileListFullPath, parentDirectory);
  await makeWebpAnimation(outputArray, parentDirectory);
  makeMp4Animation(fileListFullPath);
}
/**
 *
 * @param {string} fileListFullPath
 * @param {string|undefined} parentDirectory
 * @returns {void}
 */
async function makeMp4Animation(fileListFullPath, parentDirectory) {
  const { extension, dirName } = getPathParts(fileListFullPath[0]);
  const { width, height } = await getImageDimensions(outputArray[0]);

  // -stream_loop -1
  const ffmpegCommand = `"${ffmpeg.path}" -framerate 1 -i "${path.join(
     dirName,
    `%d.${extension}`
  )}" -c:v libx264 -pix_fmt yuv420p -y "${path.join(
   parentDirectory | dirName,
    "processed",
    "animations",
    `output_${width}_${height}.mp4`
  )}"`;
  console.log(ffmpegCommand);
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    if (stdout) {
      console.log("stdout", stdout);
    }

    if (stderr) {
      console.log(`FFmpeg output: ${stderr}`);
    }
  });
}
/**
 *
 * @param {string} outputArray
 * @param {string|undefined} parentDirectory
 * @returns {void}
 */
async function makeWebpAnimation(outputArray, parentDirectory) {
  const outputFrames = outputArray.map((outputPath) => {
    return { path: outputPath, offset: "+1000" };
  });
  try {
    const { width, height } = await getImageDimensions(outputArray[0]);
    const animationPath = await getTargetPath(
      parentDirectory || outputArray[0],
      {
        folder: "processed",
        subFolder: "animations",
        fileName: "output",
        suffix: `_${width}_${height}`,
      }
    );
    console.log(animationPath);
    await webpmux_animateLocal(
      outputFrames,
      animationPath,
      "0",
      "255,255,255,255"
    );
    console.log("Created webpmux_animate:", animationPath);
  } catch (error) {
    console.log("Error with webpmux_animate", error);
  }
}
/**
 *
 * @param {string} fileListFullPath
 * @param {string} parentDirectory
 * @returns {string[]}
 */
async function makeWebpFrames(fileListFullPath, parentDirectory) {
  const outputArray = [];
  for (const file of fileListFullPath) {
    if (isImageFile(file)) {
      try {
        const outputPath = parentDirectory
          ? await getTargetPath(parentDirectory, {
              fileName: path.basename(file).split(".")[0],
              subFolder: "frames",
            })
          : await getTargetPath(file, { subFolder: "frames" });
        await webp.cwebp(file, outputPath);
        outputArray.push(outputPath);
        console.log("Created webp:", outputPath);
      } catch (error) {
        console.log("Error with cwebp", error);
      }
    }
  }
  return outputArray;
}

/**
 * Take in filename with path
 * Create 'processed' directory (if does not exist)
 * return target filename with path
 * @param {string} fileFullPath
 * @param {{suffix: string; extension: string; folder: string; subFolder: string|undefined; fileName: string|undefined}} options
 * @returns {Promise<string>}
 */
async function getTargetPath(fileFullPath, options) {
  const {
    suffix = "",
    extension = "webp",
    folder = "processed",
    subFolder = undefined,
    fileName = undefined,
  } = options || {};
  const pathName = path.dirname(fileFullPath);
  const baseNameNoExt = fileName || path.basename(fileFullPath).split(".")[0];
  const baseName = `${baseNameNoExt}${suffix}.${extension}`;
  const newPath = subFolder
    ? await addFolderToPath(await addFolderToPath(pathName, folder), subFolder)
    : await addFolderToPath(pathName, folder);
  const destination = path.join(newPath, baseName);
  return destination;
}
/**
 *
 * @param {string} pathName
 * @param {string} folder
 * @returns {promise<string>}
 */
async function addFolderToPath(pathName, folder) {
  const newPath = path.join(pathName, folder);
  try {
    await fs.access(newPath);
    return newPath;
  } catch (error) {
    await fs.mkdir(newPath);
    return newPath;
  }
}

/**
 *
 * @param {string} fileFullPath
 * @returns  { {baseName:string; baseNameNoExtension:string; extension:string; dirName:string;} }
 */
function getPathParts(fileFullPath) {
  const baseName = path.basename(fileFullPath);
  const dirName = path.dirname(fileFullPath);
  const [baseNameNoExtension, extension] = baseName.split(".");
  return { baseName, baseNameNoExtension, extension, dirName };
}
