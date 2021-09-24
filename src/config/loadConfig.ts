import {readFile} from "fs/promises";
import {LoadTesterConfig} from "../../types/loadTesterConfig";

const defaultConfig: LoadTesterConfig = {
    amount: 60,
    hostname: "localhost",
    port: 25565,
    namePath: "./words.txt",

};

export const loadConfig = async (path: string): Promise<LoadTesterConfig> => {
    try {
        let content = await readFile(path, "utf-8");
        return JSON.parse(content);
    } catch (exception) {
        console.error(exception);
        return defaultConfig;
    }
}