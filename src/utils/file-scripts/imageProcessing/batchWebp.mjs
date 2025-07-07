import { listFileFullPaths } from "../general/fileOperations.mjs";
import { logTimestampArrow } from "@gld5000k/timestamp";
import { createWebPAnimation } from "./webpAnimationMaker.mjs";

logTimestampArrow();
const { fileList } = await listFileFullPaths();
console.log("fileList:", fileList);
await createWebPAnimation(fileList);
// console.log('newFileList:', newFileList);
// const fileObject = await makeImageObjectsV4(newFileList);
// console.log('fileObject:', fileObject);
// saveImageObject(fileObject);
