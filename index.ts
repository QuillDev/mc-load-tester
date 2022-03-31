import { loadWords } from "./src/names/names";
import { login } from "./src/minecraft/login";
import { BotOptions } from "mineflayer";
import { spawnInstances } from "./src/spawner/spawnInstances";
import { generateSessionData } from "./src/spawner/generateSessionData";
import { pathfinder, Movements } from 'mineflayer-pathfinder'
import MinecraftData from "minecraft-data";
import { moveRandom } from "./src/movement/movement"

(async () => {

    const args = require('minimist')(process.argv.slice(2));

    //Get data we want from the command line args
    const child = args["child"] as boolean ?? false;

    if (!child) {
        const sessions = args["sessions"] ?? 2 as number;
        const totalUsers = args["amount"] ?? 11 as number;
        const host = args["host"] ?? "localhost" as string;
        const port = args["port"] as number ?? 25565;
        const delay = args["delay"] as number ?? 3000;
        const namePath = args["namePath"] ?? "./resources/names.txt" as string;
        await loadWords(namePath);

        let sessionData = await generateSessionData(sessions, totalUsers, host, port);
        await spawnInstances(sessionData, delay);
    } else {
        const data = args["data"] ?? "" as string;
        let loginData: BotOptions[] = (!data) ? [] : JSON.parse(Buffer.from(data, 'base64').toString());

        let success = 0;
        await Promise.all(loginData.map(async (config) => {
            const bot = await login(config)
            success++

            bot.once('spawn', () => {
                bot.chat(`Hello I'm ${bot.username}`)
                bot.loadPlugin(pathfinder)

                const data = MinecraftData(bot.version)

                var moves = new Movements(bot, data)
                moves.canDig = false
                moves.allow1by1towers = false
                moves.allowFreeMotion = true
                bot.pathfinder.setMovements(moves)

            })

            bot.on('chat', (_, message) => {
                if (message === "move") {
                    moveRandom(bot)
                }
            })

        }));

        console.info(`Processed ${success}/${loginData.length} sessions.`);
    }
})();

