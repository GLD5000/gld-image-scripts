import { listFileFullPathsMulti } from "../general/fileOperations.mjs";
import { createTimestamp } from "../general/timestamp.mjs";
import { createWebPAnimation } from "./webpAnimationMaker.mjs";

console.log("starting", createTimestamp());
const { fileList, inputPath } = await listFileFullPathsMulti(
  `C:/Users/gareth.devlin/OneDrive - Whittard/Documents/assets/039 GWP LB Animated/WEB resize - Copy`
);
console.log("fileList:", fileList);
for (let i in fileList) {
  console.log(fileList[i]);
  await createWebPAnimation(fileList[i], inputPath);
}
