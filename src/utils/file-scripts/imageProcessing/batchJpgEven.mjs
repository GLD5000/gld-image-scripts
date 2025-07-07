import { listFileFullPaths } from "../general/fileOperations.mjs";
import { renameFiles } from "./imageEditing.mjs";
import { logTimestampArrow } from "@gld5000k/timestamp";
import { makeImageObjectsV4 } from "./createImageObjectsV4.mjs";
import { saveImageObject } from "./saveImageObject.mjs";
import path from "path";

logTimestampArrow();
const { fileList } = await listFileFullPaths();
// console.log('fileList:', fileList);
const shouldMakeEven = true;
const { newFileList } = await renameFiles(fileList, shouldMakeEven);
// console.log('newFileList:', newFileList);
const fileObject = await makeImageObjectsV4(newFileList);
// console.log('fileObject:', fileObject);
const pathIn = path.dirname(fileList[0]);
saveImageObject(fileObject, pathIn);
