import { listFileFullPaths } from '../general/fileOperations.mjs';
import { createTimestampArrow } from '../general/timestamp.mjs';
import { createWebPAnimation } from './webpAnimationMaker.mjs';

console.log('starting', createTimestampArrow());
const { fileList } = await listFileFullPaths();
console.log('fileList:', fileList);
await createWebPAnimation(fileList);
// console.log('newFileList:', newFileList);
// const fileObject = await makeImageObjectsV4(newFileList);
// console.log('fileObject:', fileObject);
// saveImageObject(fileObject);
