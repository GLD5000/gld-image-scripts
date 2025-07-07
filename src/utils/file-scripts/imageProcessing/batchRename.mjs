import { listFileFullPaths } from "../general/fileOperations.mjs";
import { logTimestampArrow } from "@gld5000k/timestamp";
import { suffixFolderName } from "../general/renameFiles.mjs";

logTimestampArrow();
const { fileList } = await listFileFullPaths();
console.log("fileList:", fileList);
for (let i in fileList) {
  await suffixFolderName(fileList[i]);
}
