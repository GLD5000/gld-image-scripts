import { listFileFullPaths } from '../general/fileOperations.mjs';
import { createTimestamp } from '../general/timestamp.mjs';
import { createWebPAnimation } from './webpAnimationMaker.mjs';

console.log('starting', createTimestamp());
const { fileList } = await listFileFullPaths(`C:/Users/gareth.devlin/OneDrive - Whittard/Documents/assets/039 GWP LB Animated/WEB resize/Web 480_343`);
console.log('fileList:', fileList);
await createWebPAnimation(fileList);
// console.log('newFileList:', newFileList);
// const fileObject = await makeImageObjectsV4(newFileList);
// console.log('fileObject:', fileObject);
// saveImageObject(fileObject);
