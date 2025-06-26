import * as readline from 'readline';
import path from 'path';
import { isImageFile } from '../general/fileTypeTests.mjs';

/**
 * Makes JSON objects for image files
 *
 * @export
 * @async
 * @param {string[]} files
 * @returns {Promise<{[key:string]:{[key:string]:string}}>}
 */
export async function makeImageObjectsV2(files) {
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
        const baseName = path.basename(fileName);
        const { widthPx, heightPx, widthRem, heightRem } =
            extractWidthHeight(baseName);

        const dimensions = {
            width: {
                px: `${widthPx}px`,
                rem: `${widthRem}rem`,
                mobileVw: `${Math.round((widthPx / 768) * 10000) * 0.01}vw`,
                tabletVw: `${Math.round((widthPx / 1200) * 10000) * 0.01}vw`,
                desktopVw: `${Math.round((widthPx / 1920) * 10000) * 0.01}vw`,
            },
            height: {
                px: `${heightPx}px`,
                rem: `${heightRem}rem`,
            },
            aspect: `${widthPx}/${heightPx}`,
        };

        returnObject[baseName] = {
            src: encodeURI(`${cleanDirPath}${baseName}`),
            width: widthPx,
            height: heightPx,
            twProps: {
                width: {
                    px: dimensions.width.px,
                    rem: dimensions.width.rem,
                    mobileVw: dimensions.width.mobileVw,
                    tabletVw: dimensions.width.tabletVw,
                    desktopVw: dimensions.width.desktopVw,
                },
                height: {
                    px: dimensions.height.px,
                    rem: dimensions.height.rem,
                },
                aspect: {
                    base: `aspect-[${dimensions.aspect}]`,
                    md: `md:aspect-[${dimensions.aspect}]`,
                    newDesktop: `newDesktop:aspect-[${dimensions.aspect}]`,
                    newDesktopRewards: `newDesktopRewards:aspect-[${dimensions.aspect}]`,
                },
                maxWidth: {
                    base: `max-w-[${dimensions.width.rem}]`,
                    md: `md:max-w-[${dimensions.width.rem}]`,
                    newDesktop: `newDesktop:max-w-[${dimensions.width.rem}]`,
                    newDesktopRewards: `newDesktopRewards:max-w-[${dimensions.width.rem}]`,
                },
                maxWidthVw: {
                    base: `max-w-[min(${dimensions.width.rem},${dimensions.width.mobileVw})]`,
                    md: `md:max-w-[min(${dimensions.width.rem},${dimensions.width.tabletVw})]`,
                    newDesktop: `newDesktop:max-w-[min(${dimensions.width.rem},${dimensions.width.desktopVw})]`,
                    newDesktopRewards: `newDesktopRewards:max-w-[min(${dimensions.width.rem},${dimensions.width.desktopVw})]`,
                },
            },
        };
    });
    return returnObject;
}

function extractWidthHeight(fileName) {
    if (fileName.indexOf('_') === -1)
        throw new Error('File name does not have dimensions.');
    const dimensionsRegex = /([\d]+\_[\d]+)$/;
    const dimensionsPortion = fileName
        .replace(/(\.[\w]+)$/, '')
        .match(dimensionsRegex)[0];
    const [widthPx, heightPx] = dimensionsPortion.split('_');
    const widthRem = `${Math.round((Number(widthPx) / 16) * 1000) * 0.001}`;
    const heightRem = `${Math.round((Number(heightPx) / 16) * 1000) * 0.001}`;
    return { widthPx, heightPx, widthRem, heightRem };
}

