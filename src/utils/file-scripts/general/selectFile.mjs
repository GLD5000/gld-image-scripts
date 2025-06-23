import { listFileFullPaths } from '../imageProcessing/fileOperations.mjs';
import { createTimestamp } from '../imageProcessing/timestamp.mjs';
import { selectImageFromText } from './selectLineFromText.mjs';
import path from 'path';

(async () => {
    try {
        const testDir =
            'C:\\Users\\gareth.devlin\\OneDrive - Whittard\\Documents\\assets\\018 Autumn Homepage\\Exports\\Updated 6\\';
        console.log('starting', createTimestamp());
        const { fileList } = await listFileFullPaths(testDir);
        console.log('fileList:', fileList);
        const filteredFileList = fileList.filter((fileLine) =>
            ['.jpg', '.png', '.jpeg', '.gif'].includes(path.extname(fileLine))
        );
        const selectedLine = await selectImageFromText(filteredFileList);
        console.log(`Selected line: ${selectedLine}`);
    } catch (error) {
        console.error('Error:', error);
    }
})();
