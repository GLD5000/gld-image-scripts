import path from 'path';

//get os type then return path of respective platform library 
export function webpmux() {
    if (process.platform === 'darwin') {

        return path.join(process.cwd(), "/node_modules/webp-converter/bin/libwebp_osx/bin/webpmux");//return osx library path

    }else if (process.platform === 'linux') {

        return path.join(process.cwd(), "/node_modules/webp-converter/bin/libwebp_linux/bin/webpmux");//return linux library path

    }else if (process.platform === 'win32') {

        if (process.arch === 'x64') {
            return path.join(process.cwd(), "\\node_modules\\webp-converter\\bin\\libwebp_win64\\bin\\webpmux.exe");//return windows 64bit library path
        } else {
            console.log('Unsupported platform:', process.platform, process.arch);//show unsupported platform message
        }
    } else {
        console.log('Unsupported platform:', process.platform, process.arch);//show unsupported platform message 
    }
};
//node_modules/webp-converter/bin/libwebp_win64/bin/webpmux.exe