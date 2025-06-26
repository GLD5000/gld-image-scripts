import { listFileNames } from '../general/fileOperations.mjs';
import { makeImageObjectsV2 } from './createImageObjectsV2.mjs';
import { saveImageObject } from './saveImageObject.mjs';

const { fileList } = await listFileNames();
// console.log('fileList:', fileList);
const fileObject = await makeImageObjectsV2(fileList);
// console.log('fileObject:', fileObject);
saveImageObject(fileObject);
