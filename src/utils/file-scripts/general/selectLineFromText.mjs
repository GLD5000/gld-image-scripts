import readline from 'readline';
import path from 'path';
import { getImageDimensions } from '../imageProcessing/imageEditing.mjs';
/**
 *
 * @param {string[]} lines
 * @param {number} defaultNumber
 * @returns
 */
export async function selectLineFromText(
    lines,
    defaultNumber = 1,
    title = 'Select a line:'
) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log(title + '\n');

        lines.forEach((line, index) => {
            console.log(`${index + 1}. ${line}`);
        });

        rl.question(
            '\n' +
                `Enter line number to select (default is ${lines[defaultNumber - 1]}): `,
            (answer) => {
                let lineNumber;

                try {
                    lineNumber = parseInt(answer);

                    if (
                        isNaN(lineNumber) ||
                        lineNumber <= 0 ||
                        lineNumber > lines.length
                    ) {
                        resolve(lines[defaultNumber - 1]);
                    }

                    resolve(lines[lineNumber - 1]);
                } catch (error) {
                    console.error(
                        'Invalid input. Please enter a valid line number.',
                        error
                    );
                    reject(error);
                } finally {
                    rl.close();
                }
            }
        );
    });
}

export async function selectImageFromText(
    lines,
    title = 'Crop an image',
    prompt = 'Enter the number of the image you want to select: '
) {
    return new Promise(async (resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log(title + '\n');

        const list = await Promise.all(
            lines.map(async (line, index) => {
                const { width, height } = await getImageDimensions(line);
                return `${index + 1}. ${path.basename(line) || line} - ${width} x ${height}`;
            })
        );

        console.log(list.join('\n') + '\n');

        rl.question(prompt, (answer) => {
            let lineNumber;

            try {
                lineNumber = parseInt(answer);

                if (
                    isNaN(lineNumber) ||
                    lineNumber <= 0 ||
                    lineNumber > lines.length
                ) {
                    throw new Error();
                }

                resolve(lines[lineNumber - 1]);
            } catch (error) {
                console.error(
                    'Invalid input. Please enter a valid line number.'
                );
                reject(error);
            } finally {
                rl.close();
            }
        });
    });
}
