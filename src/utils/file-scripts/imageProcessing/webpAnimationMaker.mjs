import path from "path";
import { exec } from "child_process";
import webp from "webp-converter";
import {
  getImageDimensions,
  getEvenImageDimensions,
} from "../imageProcessing/imageEditing.mjs";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { webpmux_animateLocal } from "../../webp/webpConverterLocal.mjs";
import { isImageFile } from "../general/fileTypeTests.mjs";
import { getTargetPath, getPathParts } from "../general/fileOperations.mjs";
import sharp from "sharp";


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
  const { width, height } = await getImageDimensions(fileListFullPath[0]);

  // -stream_loop -1
  const ffmpegCommand = `"${ffmpeg.path}" -framerate 1 -i "${path.join(
    dirName,
    `%d.${extension}`
  )}" -c:v libx264 -pix_fmt yuv420p -y "${path.join(
    parentDirectory || dirName,
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
  const { width, height, shouldCrop } = getEvenImageDimensions(
    fileListFullPath[0]
  );
  for (const file of fileListFullPath) {
    const isImage = isImageFile(file);
    if (isImage) {
      shouldCrop && await cropInputFrame(file, width, height); // Crop as needed
     return await makeWebpFrame(parentDirectory, file, outputArray);
    } 
  }
}
async function cropInputFrame(file, width, height) {
  copyFileToNewFolder(file, "old");
  await sharp(tempPath)
    .extract({ left: 0, top: 0, width, height })
    .toFile(file);
}
/**
 * 
 * @param {string} parentDirectory 
 * @param {string} file 
 * @param {string[]} outputArray 
 * @returns 
 */
async function makeWebpFrame(parentDirectory, file, outputArray) {
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
  return outputArray;
}

