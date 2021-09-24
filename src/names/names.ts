import { readFile } from "fs/promises"

const words: string[] = [];

export const loadWords = async (path: string) => {
    await readFile(path, "utf8")
        .then((content) => {
            content.split('\n').forEach((word) => {
                let newWord =  word.split(" ").map((subWord) => {
                    return subWord.charAt(0).toUpperCase() + subWord.slice(1, subWord.length);
                }).join("");
                words.push(newWord);
            });
        });
}


const names: string[] = [];

export const generateNewName = async (): Promise<string> => {
    let name = generateName(1, 2);
    if (names.includes(name)) {
        return generateNewName();
    }

    names.push(name);

    return name;
}


export const generateName = (minSize: number, maxSize: number): string => {

    const length = Math.random() * (maxSize - minSize) + minSize;

    let name = "";
    for (let idx = 0; idx < length; idx++) {
        name += words[Math.round(Math.random() * (words.length - 1))];
    }
     
    return name.substring(0, Math.min(name.length, 16)).toString();
}

