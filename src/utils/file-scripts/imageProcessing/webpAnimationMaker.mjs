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
export async function createWebPAnimation(fileListFullPath) {
  // Validate inputs
  if (!Array.isArray(fileListFullPath) || fileListFullPath.length === 0) {
    throw new Error("Input files must be a non-empty array");
  }
  const outputArray = [];
  for (const file of fileListFullPath) {
    if (isImageFile(file)) {
      try {
        const outputPath = await getTargetPathWebp(file);
        await webp.cwebp(file, outputPath);
        outputArray.push(outputPath);
        console.log("Created webp:", outputPath);
      } catch (error) {
        console.log("Error with cwebp", error);
      }
    }
  }
  const outputFrames = outputArray.map((outputPath) => {
    return { path: outputPath, offset: "+1000" };
  });
  try {
    const { width, height } = await getImageDimensions(outputArray[0]);
    const animationPath = await getTargetPathWebp(outputArray[0], {
      folder: "processedAnimation",
      fileName: "output",
      suffix: `_${width}_${height}`,
    });
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
  const { extension, dirName } = getPathParts(fileListFullPath[0]);
  // -stream_loop -1
  const ffmpegCommand = `"${ffmpeg.path}" -framerate 1 -i "${path.join(
    dirName,
    `%d.${extension}`
  )}" -c:v libx264 -pix_fmt yuv420p -y "${path.join(
    dirName,
    "processed",
    "processedAnimation",
    "output.mp4"
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
 * Take in filename with path
 * Create 'processed' directory (if does not exist)
 * return target filename with path
 * @param {string} fileFullPath
 * @returns {Promise<string>}
 */
async function getTargetPathWebp(fileFullPath, options) {
  const {
    suffix = "",
    extension = "webp",
    folder = "processed",
    fileName = undefined,
  } = options || {};
  const pathName = path.dirname(fileFullPath);
  const baseNameNoExt = fileName || path.basename(fileFullPath).split(".")[0];
  const baseName = `${baseNameNoExt}${suffix}.${extension}`;
  const newPath = path.join(pathName, folder);
  const destination = path.join(newPath, baseName);
  try {
    await fs.access(newPath);
  } catch (error) {
    await fs.mkdir(newPath);
  }
  return destination;
}
function getPathParts(fileFullPath) {
  const baseName = path.basename(fileFullPath);
  const dirName = path.dirname(fileFullPath);
  const [baseNameNoExtension, extension] = baseName.split(".");
  return { baseName, baseNameNoExtension, extension, dirName };
}
