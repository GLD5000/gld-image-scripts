import { listFileFullPathsMulti } from "../general/fileOperations.mjs";
import { createTimestampArrow } from "../general/timestamp.mjs";
import { createWebPAnimation } from "./webpAnimationMaker.mjs";

console.log("starting", createTimestampArrow());
const { fileLists, inputPath } = await listFileFullPathsMulti(
  `C:/Users/gareth.devlin/OneDrive - Whittard/Documents/assets/039 GWP LB Animated/WEB resize - Copy`
);
console.log("fileLists:", fileLists);
for (let i in fileLists) {
  console.log(fileLists[i]);
  await createWebPAnimation(fileLists[i].fileList);
}
