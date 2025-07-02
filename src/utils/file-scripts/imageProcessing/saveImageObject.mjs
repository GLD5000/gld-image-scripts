import fs from "fs";
import path from "path";
import { createTimestampArrow } from "../general/timestamp.mjs";

export function saveImageObject(objectIn, pathIn) {
  const quoteRegex = /"(imageDimensions\[[^\]]+\])"/g;
  const objectString = `const imageDimensions = ${JSON.stringify(
    objectIn.imageDimensions
  )};
export const imageMapper = ${JSON.stringify(objectIn.imageMapper)};`.replaceAll(
    quoteRegex,
    "$1"
  );
  const fileName = `${createTimestampArrow()}.ts`;
  const fullJsonFilePath = pathIn
    ? path.join(pathIn, fileName)
    : path.join(process.cwd(), "public", "imageObjects", fileName);

  try {
    fs.writeFileSync(fullJsonFilePath, objectString);
    console.log(`JSON file created at ${fullJsonFilePath}`);
  } catch (error) {
    console.error("Error creating JSON:", error);
  }
}
