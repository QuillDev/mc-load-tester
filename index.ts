import {loadWords} from "./src/names/names";
import {login} from "./src/minecraft/login";
import {BotOptions} from "mineflayer";
import {spawnInstances} from "./src/spawner/spawnInstances";
import {generateSessionData} from "./src/spawner/generateSessionData";


(async () => {


    const args = require('minimist')(process.argv.slice(2));

    //Get data we want from the command line args
    const child = args["child"] as boolean ?? false;

    if (!child) {
        const sessions = args["sessions"] ?? 2 as number;
        const totalUsers = args["amount"] ?? 11 as number;
        const host = args["host"] ?? "localhost" as string;
        const port = args["port"] as number ?? 25565;
        const namePath = args["namePath"] ?? "./resources/names.txt" as string;
        await loadWords(namePath);

        let sessionData = await generateSessionData(sessions, totalUsers, host, port);
        await spawnInstances(sessionData);
    } else {
        const data = args["data"] ?? "" as string;
        let loginData: BotOptions[] = (!data) ? [] : JSON.parse(Buffer.from(data, 'base64').toString());

        let success = 0;
        await Promise.all(loginData.map(async (config) => {
            await login(config);
        }));
        console.info(`Processed ${success}/${loginData.length} sessions.`);
    }
})();
