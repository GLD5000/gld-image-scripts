import { listFileFullPathsMulti } from "../general/fileOperations.mjs";
import { createTimestampArrow } from "../general/timestamp.mjs";
import { createWebPAnimation } from "./webpAnimationMaker.mjs";
import { subFolderSearch } from "../general/search.mjs";

console.log("starting", createTimestampArrow());
const { fileLists, inputPath } = await listFileFullPathsMulti();
console.log("inputPath:", inputPath);
console.log("subFolderSearch(inputPath)", subFolderSearch(inputPath));
// for (let i in fileLists) {
//   await createWebPAnimation(fileLists[i].fileList);
// }
