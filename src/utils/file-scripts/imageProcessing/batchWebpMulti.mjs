import { listFileFullPathsMulti } from "../general/fileOperations.mjs";
import { createTimestampArrow } from "../general/timestamp.mjs";
import { createWebPAnimation } from "./webpAnimationMaker.mjs";
import { subFolderSearch } from "../general/search.mjs";
import { copyFileToNewFolder } from "./imageEditing.mjs";

console.log("starting", createTimestampArrow());
const { fileLists, inputPath } = await listFileFullPathsMulti();
for (let i in fileLists) {
  await createWebPAnimation(fileLists[i].fileList);
}
const animations = subFolderSearch(inputPath);

for (let i in animations) {
  await copyFileToNewFolder(animations[i], inputPath);
}
