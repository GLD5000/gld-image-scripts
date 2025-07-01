import path from "path";
import { exec } from "child_process";
import webp from "webp-converter";
import {
  getImageDimensions,
  getEvenImageDimensions,
  copyFileToNewFolder,
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
export async function createWebPAnimation(fileListFullPath) {
  // Validate inputs
  if (!Array.isArray(fileListFullPath) || fileListFullPath.length === 0) {
    throw new Error("Input files must be a non-empty array");
  }
  const webpFrames = await makeWebpFrames(fileListFullPath);
  await makeWebpAnimation(webpFrames);
  makeMp4Animation(fileListFullPath);
}
/**
 *
 * @param {string} fileListFullPath
 * @returns {void}
 */
async function makeMp4Animation(fileListFullPath) {
  const { extension, dirName } = getPathParts(fileListFullPath[0]);
  const { width, height } = await getImageDimensions(fileListFullPath[0]);

  // -stream_loop -1
  const ffmpegCommand = `"${ffmpeg.path}" -framerate 1 -i "${path.join(
    dirName,
    `%d.${extension}`
  )}" -c:v libx264 -pix_fmt yuv420p -y "${path.join(
    dirName,
    "processed",
    "animation",
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
 * @returns {void}
 */
async function makeWebpAnimation(outputArray) {
  const outputFrames = outputArray.map((outputPath) => {
    return { path: outputPath, offset: "+1000" };
  });
  try {
    const { width, height } = await getImageDimensions(outputArray[0]);
    const animationPath = await getTargetPath(outputArray[0], {
      fileName: "output",
      folders:['animation'],
      suffix: `_${width}_${height}`,
    });
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
 * @returns {string[]}
 */
async function makeWebpFrames(fileListFullPath) {
  const outputArray = [];
  const { width, height, shouldCrop } = await getEvenImageDimensions(
    fileListFullPath[0]
  );
  for (const file of fileListFullPath) {
    const isImage = isImageFile(file);
    if (isImage) {
      shouldCrop && (await cropInputFrame(file, width, height)); // Crop as needed
      outputArray.push(await makeWebpFrame(file));
    }
  }
  return outputArray;
}
async function cropInputFrame(file, width, height) {
  const oldFile = await copyFileToNewFolder(file, "old");
  await sharp(oldFile).extract({ left: 0, top: 0, width, height }).toFile(file);
}
/**
 *
 * @param {string} file
 * @param {string[]} outputArray
 * @returns
 */
async function makeWebpFrame(file) {
  try {
    const outputPath = await getTargetPath(file, { folders: ["processed"] });
    await webp.cwebp(file, outputPath);
    console.log("Created webp:", outputPath);
    return outputPath;
  } catch (error) {
    console.log("Error with cwebp", error);
  }
}
