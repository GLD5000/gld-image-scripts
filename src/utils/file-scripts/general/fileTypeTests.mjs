import path from "path";
/**
 * Check if file is folder
 * @param {string} fileString
 * @returns {boolean}
 */
export function isFolder(fileString) {
  return path.extname(fileString) === "";
}
/**
 * Check if file is image
 *
 * @param {string} file
 * @returns {boolean}
 */
export function isImageFile(file) {
  const fileExtension = path.extname(file);
  return [".jpg", ".png", ".jpeg", ".gif", ".webp", ".mp4"].includes(
    fileExtension
  );
}
/**
 * Check if file is PNG
 *
 * @param {string} file
 * @returns {boolean}
 */
export function isPngFile(file) {
  return file.endsWith(".png");
}
export function getFileType(file) {
  const fileIsFolder = isFolder(file);
  if (fileIsFolder) return "folder";
  const fileIsImageFile = isImageFile(file);
  if (fileIsImageFile) return "image";
  return "other";
}
export function getFileTypeName(file) {
  const name = path.basename(file);
  const fileIsFolder = isFolder(file);
  if (fileIsFolder) return { name, type: "folder" };
  const fileIsImageFile = isImageFile(file);
  if (fileIsImageFile) return { name, type: "image" };
  return { name, type: "other" };
}
