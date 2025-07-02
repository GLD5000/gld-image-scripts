import { getPathParts } from "./fileOperations.mjs";
import path from "path";
import { isFolder } from "./fileTypeTests.mjs";

export function prefixName(fileString, additionalString) {}
export function suffixName(fileString, additionalString) {}
export function replaceName(fileString, additionalString, matchString) {}
export async function suffixFolderName(fileString) {
  if (isFolder(fileString)) return;
  const { dirName, baseNameNoExtension, extension } = getPathParts(fileString);
  const parentFolder = path.basename(dirName);
  const dimensionsRegex = /_?\d+\_\d+$/;
  const dimensions = baseNameNoExtension.match(dimensionsRegex);
  const newFileString = path.join(
    dirName,
    `${
      dimensions
        ? baseNameNoExtension.replace(dimensions[0], "")
        : baseNameNoExtension
    }${parentFolder}${dimensions ? dimensions[0] : ""}${extension}`
    );
    console.log(newFileString);
  // get parent folder name
  // suffix to file name ahead of dimensions
}
