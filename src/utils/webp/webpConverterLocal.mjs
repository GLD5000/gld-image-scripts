export function webpmux_animateLocal(input_images,output_image,loop,bgcolor) {
    let files=`-frame "${input_images[0]["path"]}" ${input_images[0]["offset"]}`;

let j=input_images.length;

for (i = 1; i < j; i++) { 
    files=`${files} -frame "${input_images[i]["path"]}" ${input_images[i]["offset"]}`;
}

const query = `${files} -loop ${loop} -bgcolor ${bgcolor} -o "${output_image}"`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
  exec(`"${webpmux()}"`,query.split(/\s+/),{ shell: true }, (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});

}