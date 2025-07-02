import { listFileFullPaths } from "../general/fileOperations.mjs";
import { createTimestampArrow } from "../general/timestamp.mjs";
import { suffixFolderName } from "../general/renameFiles.mjs";

console.log("starting", createTimestampArrow());
const { fileList } = await listFileFullPaths();
console.log("fileList:", fileList);
for (let i in fileList) {
  await suffixFolderName(fileList[i]);
}