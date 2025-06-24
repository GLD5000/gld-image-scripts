import { exec } from "child_process";
import { webpmux } from "./webpmuxLocal.mjs";

export async function webpmux_animateLocal(
  input_images,
  output_image,
  loop,
  bgcolor
) {
  let files = `-frame "${input_images[0]["path"]}" ${input_images[0]["offset"]}`;

  let j = input_images.length;

  for (let i = 1; i < j; i++) {
    files = `${files} -frame "${input_images[i]["path"]}" ${input_images[i]["offset"]}`;
  }

  const query = `${files} -loop ${loop} -bgcolor ${bgcolor} -o "${output_image}"`;

  //webpmux() return which platform webp library should be used for conversion

  const command = `"${webpmux()}" ${query}`;
  return await exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    if (stdout) {
      console.log("stdout", stdout);
    }

    if (stderr) {
      console.log(`FFmpeg output: ${stderr}`);
    }
  });
}
