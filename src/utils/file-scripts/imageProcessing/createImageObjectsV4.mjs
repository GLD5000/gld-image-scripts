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
export async function makeImageObjectsV4(files) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        try {
            const filesObject = makeObjects('[IMAGE PATH]', files);
            resolve(filesObject);
        } catch (error) {
            console.error(`Error reading directory:`, error);
            reject(error);
        } finally {
            rl.close(); // Close the readline interface after operation
        }
    });
}
function makeObjects(dirPath, files) {
    const imageDimensions = {};
    const filteredFiles = files.filter(isImageFile);
    const cleanDirPath = `/${dirPath}/`.replaceAll('//', '/');
    filteredFiles.forEach((fileName) => {
        const baseName = path.basename(fileName);
        imageDimensions[baseName] = makeImageObjectDimensions(
            baseName,
            cleanDirPath
        );
    });
    const imageMapper = getImageMapper('imageDimensions', filteredFiles);
    return { imageDimensions, imageMapper };
}
function makeImageObjectDimensions(baseName, cleanDirPath) {
    const { widthPx, heightPx, widthRem, heightRem } =
        extractWidthHeight(baseName);

    const dimensions = {
        width: {
            px: `${widthPx}px`,
            rem: `${widthRem}rem`,
            doubleRem: `${Number(widthRem) * 2}rem`,
            phoneVw: `${Math.round((widthPx / 480) * 10000) * 0.01}vw`,
            phabletVw: `${Math.round((widthPx / 768) * 10000) * 0.01}vw`,
            mobileVw: `${Math.round((widthPx / 768) * 10000) * 0.01}vw`,
            tabletVw: `${Math.round((widthPx / 1200) * 10000) * 0.01}vw`,
            desktopVw: `${Math.round((widthPx / 1920) * 10000) * 0.01}vw`,
            doubleDesktopVw: `${Math.round(((2 * widthPx) / 1920) * 10000) * 0.01}vw`,
        },
        height: {
            px: `${heightPx}px`,
            rem: `${heightRem}rem`,
        },
        aspect: `${widthPx}/${heightPx}`,
        doubleAspect: `${widthPx * 2}/${heightPx}`,
    };
    return {
        src: encodeURI(`${cleanDirPath}${baseName}`),
        width: widthPx,
        height: heightPx,
        twProps: {
            width: {
                px: dimensions.width.px,
                rem: dimensions.width.rem,
                doubleRem: dimensions.width.doubleRem,
                phoneVw: dimensions.width.phoneVw,
                phabletVw: dimensions.width.phabletVw,
                mobileVw: dimensions.width.mobileVw,
                tabletVw: dimensions.width.tabletVw,
                desktopVw: dimensions.width.desktopVw,
                doubleDesktopVw: dimensions.width.doubleDesktopVw,
            },
            height: {
                px: dimensions.height.px,
                rem: dimensions.height.rem,
            },
            aspect: {
                base: `aspect-[${dimensions.aspect}]`,
                phone: `aspect-[${dimensions.aspect}]`,
                phablet: `phablet:aspect-[${dimensions.aspect}]`,
                md: `md:aspect-[${dimensions.aspect}]`,
                newDesktop: `newDesktop:aspect-[${dimensions.aspect}]`,
                doubleNewDesktop: `newDesktop:aspect-[${dimensions.doubleAspect}]`,
                newDesktopRewards: `newDesktopRewards:aspect-[${dimensions.aspect}]`,
                doubleNewDesktopRewards: `newDesktopRewards:aspect-[${dimensions.doubleAspect}]`,
            },
            maxWidth: {
                base: `max-w-[${dimensions.width.rem}]`,
                phone: `max-w-[${dimensions.width.rem}]`,
                phablet: `phablet:max-w-[${dimensions.width.rem}]`,
                md: `md:max-w-[${dimensions.width.rem}]`,
                newDesktop: `newDesktop:max-w-[${dimensions.width.rem}]`,
                doubleNewDesktop: `newDesktop:max-w-[${dimensions.width.doubleRem}]`,
                newDesktopRewards: `newDesktopRewards:max-w-[${dimensions.width.rem}]`,
                doubleNewDesktopRewards: `newDesktopRewards:max-w-[${dimensions.width.doubleRem}]`,
            },
            maxWidthVw: {
                base: `max-w-[min(${dimensions.width.rem},${dimensions.width.mobileVw})]`,
                phone: `max-w-[min(${dimensions.width.rem},${dimensions.width.phoneVw})]`,
                phablet: `phablet:max-w-[min(${dimensions.width.rem},${dimensions.width.phabletVw})]`,
                md: `md:max-w-[min(${dimensions.width.rem},${dimensions.width.tabletVw})]`,
                newDesktop: `newDesktop:max-w-[min(${dimensions.width.rem},${dimensions.width.desktopVw})]`,
                doubleNewDesktop: `newDesktop:max-w-[min(${dimensions.width.doubleRem},${dimensions.width.doubleDesktopVw})]`,
                newDesktopRewards: `newDesktopRewards:max-w-[min(${dimensions.width.rem},${dimensions.width.desktopVw})]`,
                doubleNewDesktopRewards: `newDesktopRewards:max-w-[min(${dimensions.width.doubleRem},${dimensions.width.doubleDesktopVw})]`,
            },
        },
    };
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

function getImageMapper(objectName, images) {
    const returnObject = {};
    const blogs = {};
    const dimensionsRegex = /([\d]+\_[\d]+)$/;
    const extensionRegex = /(\.[^\.]+)$/;
    const breakpointRegex = /tablet|desktop|mobile|phone|phablet/;
    const typeRegex = /blog|promo|promobox|promo-box/;
    const punctuationRegex = /[-_]+/g;
    images.forEach((pathName) => {
        const key = path.basename(pathName);
        const groupName = deCapitaliseFirstLetter(
            key
                .replace(extensionRegex, '')
                .replace(dimensionsRegex, '')
                .replace(breakpointRegex, '')
                .replace(typeRegex, '')
                .replaceAll(punctuationRegex, '-')
                .split('-')
                .map((text) =>
                    text ? `${text[0].toUpperCase()}${text.slice(1)}` : text
                )
                .join('')
        );

        const breakpointMatch = key.toLocaleLowerCase().match(breakpointRegex);
        const breakpoint = breakpointMatch ? breakpointMatch[0] : 'desktop';
        const typeMatch = key.toLocaleLowerCase().match(typeRegex);
        const type = typeMatch ? typeMatch[0] : null;
        if (type === 'promo' || type === 'promobox' || type === 'promo-box') {
            returnObject[`promobox`] = {
                ...returnObject[`promobox`],
                [`${groupName.replace('box', '')}`]: `${objectName}['${key}']`,
            };
        } else if (type === 'blog') {
            blogs[`${groupName}`] = {
                ...blogs[`${groupName}`],
                [`${breakpoint}`]: `${objectName}['${key}']`,
                alt: `${groupName}`,
            };
        } else {
            returnObject[`${groupName}`] = {
                ...returnObject[`${groupName}`],
                [`${breakpoint}`]: `${objectName}['${key}']`,
            };
        }
    });
    return Object.keys(blogs).length > 0
        ? { ...returnObject, blogs }
        : returnObject;
}

function deCapitaliseFirstLetter(stringIn) {
    return `${stringIn[0].toLowerCase()}${stringIn.slice(1)}`;
}
