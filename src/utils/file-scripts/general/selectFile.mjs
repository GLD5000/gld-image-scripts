import { listFileFullPaths } from './fileOperations.mjs';
import { createTimestamp } from './timestamp.mjs';
import { selectImageFromText } from './selectLineFromText.mjs';
import path from 'path';

(async () => {
    try {
        const testDir =
            'C:\\Users\\gareth.devlin\\OneDrive - Whittard\\Documents\\assets\\018 Autumn Homepage\\Exports\\Updated 6\\';
        console.log('starting', createTimestampArrow());
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
