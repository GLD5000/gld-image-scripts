import path from "path";
import { getFileTypeName } from "./fileTypeTests.mjs";
import { getFileListFullPath } from "./fileOperations.mjs";

export function subFolderSearch(startPath, match = "animation") {
  const stackOfPaths = [startPath];
  const arrayOfAnimationPaths = [];
  while (stackOfPaths.length > 0) {
    const file = stackOfPaths.pop();
    const { type } = getFileTypeName(file);
    if (type === "folder") {
      const files = getFileListFullPath(file);
      stackOfPaths.push(...files);
    } else if (type === "image") {
      const isMatch = path.dirname(file).endsWith(match);
      if (isMatch) arrayOfAnimationPaths.push(file);
    }
    }
    return arrayOfAnimationPaths;
}
