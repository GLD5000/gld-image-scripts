import { listFileFullPaths } from './fileOperations.mjs';
import { createTimestamp } from './timestamp.mjs';
import { makeImageObjectsV4 } from './createImageObjectsV4.mjs';
import { saveImageObject } from './saveImageObject.mjs';
import { createWebPAnimation } from './webpAnimationMaker.mjs';

console.log('starting', createTimestamp());
const { fileList } = await listFileFullPaths(`C:/Users/gareth.devlin/OneDrive - Whittard/Documents/assets/039 GWP LB Animated/WEB resize/Web 1200_708`);
// console.log('fileList:', fileList);
await createWebPAnimation(fileList);
// console.log('newFileList:', newFileList);
// const fileObject = await makeImageObjectsV4(newFileList);
// console.log('fileObject:', fileObject);
// saveImageObject(fileObject);
