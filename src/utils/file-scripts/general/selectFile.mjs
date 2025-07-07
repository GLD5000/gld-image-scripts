import { listFileFullPaths } from './fileOperations.mjs';
import { logTimestampArrow } from '@gld5000k/timestamp';
import { selectImageFromText } from './selectLineFromText.mjs';
import path from 'path';

(async () => {
    try {
        const testDir =
            'C:\\Documents\\assets\\018 Autumn Homepage\\Exports\\Updated 6\\';
        logTimestampArrow();
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
