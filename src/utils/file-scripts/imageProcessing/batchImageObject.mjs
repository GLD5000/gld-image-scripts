import { listFileFullPaths } from "../general/fileOperations.mjs";
import { logTimestampArrow } from "@gld5000k/timestamp";
import { makeImageObjectsV4 } from "./createImageObjectsV4.mjs";
import { saveImageObject } from "./saveImageObject.mjs";
import path from "path";

logTimestampArrow();
const { fileList } = await listFileFullPaths();
// console.log('fileList:', fileList);
// const { newFileList } = await renameFiles(fileList);
// console.log('newFileList:', newFileList);
const fileObject = await makeImageObjectsV4(fileList);
// console.log('fileObject:', fileObject);
const pathIn = path.dirname(fileList[0]);
saveImageObject(fileObject, pathIn);
