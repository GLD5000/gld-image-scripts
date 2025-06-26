import path from "path";
/**
 * Check if file is folder
 * @param {string} fileString 
 * @returns {boolean}
 */
export function isFolder(fileString) {
    return fileString.indexOf('.') === -1;
}
/**
 * Check if file is image
 *
 * @param {string} file
 * @returns {boolean}
 */
export function isImageFile(file) {
    const fileExtension = path.extname(file);
    return ['.jpg', '.png', '.jpeg', '.gif','.webp','.mp4'].includes(fileExtension);
}
/**
 * Check if file is PNG
 *
 * @param {string} file
 * @returns {boolean}
 */
export function isPngFile(file) {
    return file.endsWith('.png');
}
