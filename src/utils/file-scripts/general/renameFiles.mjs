import { getPathParts } from "./fileOperations.mjs";
import path from "path";
import { isImageFile } from "./fileTypeTests.mjs";
import fs from "fs/promises";

export function prefixName(fileString, additionalString) {}
export function suffixName(fileString, additionalString) {}
export function replaceName(fileString, additionalString, matchString) {}
export async function suffixFolderName(file) {
  if (!isImageFile(file)) return;
  const { dirName, baseNameNoExtension, extension } = getPathParts(file);
  const parentFolder = path.basename(dirName);
  const lowercaseFileName = baseNameNoExtension.toLocaleLowerCase();
  const dimensionsRegex =
    /((phone)|(phablet)|(tablet)|(mobile)|(desktop))[^\d]?(\d+[^\d]\d+)?$/;
  const dimensions = lowercaseFileName.match(dimensionsRegex);
  const newFileString = path.join(
    dirName,
    `${
      dimensions
        ? lowercaseFileName.replace(dimensions[0], "")
        : lowercaseFileName
    }${parentFolder}${
      dimensions ? `-${dimensions[0].replaceAll("x", "_")}` : ""
    }${extension}`
  );
  console.log(newFileString);
  await fs.rename(file, newFileString);
}
