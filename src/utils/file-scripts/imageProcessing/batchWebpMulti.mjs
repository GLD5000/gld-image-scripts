import { listFileFullPathsMulti } from "../general/fileOperations.mjs";
import { createTimestampArrow } from "../general/timestamp.mjs";
import { createWebPAnimation } from "./webpAnimationMaker.mjs";

console.log("starting", createTimestampArrow());
const { fileLists, inputPath } = await listFileFullPathsMulti();
console.log("inputPath:", inputPath);
for (let i in fileLists) {
  await createWebPAnimation(fileLists[i].fileList);
}
