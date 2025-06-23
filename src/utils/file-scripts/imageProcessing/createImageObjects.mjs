import * as readline from 'readline';

export async function makeImageObjects(files) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Please enter the image path: ', (dirPath) => {
            if (!dirPath.trim()) {
                // console.log('Input cannot be blank. Exiting...');
                // process.exit(1); // Exit the script with status code 1 indicating an error
                console.log('Input should not be blank. Using "[IMAGE PATH]"');
                dirPath = '[IMAGE PATH]'; // Set dirPath to the current working directory
            }

            try {
                const filesObject = makeObjects(dirPath, files);
                console.error(`Returning:`, filesObject);
                resolve(filesObject);
            } catch (error) {
                console.error(`Error reading directory ${dirPath}:`, error);
                reject(error);
            } finally {
                rl.close(); // Close the readline interface after operation
            }
        });
    });
}
function makeObjects(dirPath, files) {
    const returnObject = {};
    const filteredFiles = files.filter(isImageFile);
    const cleanDirPath = `/${dirPath}/`.replaceAll('//', '/');
    filteredFiles.forEach((fileName) => {
        const { widthPx, heightPx, widthRem } = extractWidthHeight(fileName);
        returnObject[fileName] = {
            src: encodeURI(`${cleanDirPath}${fileName}`),
            width: widthPx,
            height: heightPx,
            aspect: `aspect-[${widthPx}/${heightPx}]`,
            mdaspect: `md:aspect-[${widthPx}/${heightPx}]`,
            lgaspect: `newDesktop:aspect-[${widthPx}/${heightPx}]`,
            'max-w': `max-w-[${widthRem}rem]`,
            'mdmax-w': `md:max-w-[${widthRem}rem]`,
            'lgmax-w': `newDesktop:max-w-[${widthRem}rem]`,
        };
    });
    return returnObject;
}

function extractWidthHeight(fileName) {
    const dimensionsRegex = /([\d]+\_[\d]+)$/;
    const dimensionsPortion = fileName
        .replace(/(\.[\w]+)$/, '')
        .match(dimensionsRegex)[0];
    const [widthPx, heightPx] = dimensionsPortion.split('_');
    const widthRem = `${Number(widthPx) / 16}`;
    const heightRem = `${Number(heightPx) / 16}`;
    return { widthPx, heightPx, widthRem, heightRem };
}

function isImageFile(fileName) {
    return fileName.indexOf('.jpg') > -1 || fileName.indexOf('.png') > -1;
}
