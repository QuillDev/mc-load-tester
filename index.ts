import {loadWords} from "./src/names/names";
import {login} from "./src/minecraft/login";
import {Bot, BotOptions} from "mineflayer";
import {spawnInstances} from "./src/spawner/spawnInstances";
import {generateSessionData} from "./src/spawner/generateSessionData";
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder'
import MinecraftData from "minecraft-data";

const getRandomLocation = async (bot: Bot) => {
    const oldPos = bot.entity.position
    const x = oldPos.x + ((Math.random() * maxRandom) - maxRandom / 2.0)
    const z = oldPos.z + ((Math.random() * maxRandom) - maxRandom / 2.0)
    return new goals.GoalNear(x, oldPos.y, z, 1)
}
const maxRandom = 8
const moveRandom = async (bot: Bot) => {
    const goal = await getRandomLocation(bot)

    console.log(`Moving ${bot.username} -> ${goal.x} ${goal.y} ${goal.z}`)
    //Clean up bots that go afk
    const clearer = setTimeout(() => { moveRandom(bot) }, 4000);

    //Make the bots move and clear the timeout
    await bot.pathfinder.goto(goal).then(() => {
        clearTimeout(clearer)
        moveRandom(bot)
    }).catch((_) => null);
}
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

                const mcData = MinecraftData(bot.version)
                bot.loadPlugin(pathfinder)
                var defaultMove = new Movements(bot, mcData)
                defaultMove.allowFreeMotion = false
                bot.pathfinder.setMovements(defaultMove)

            })

            bot.on('chat', (_, message) => {
                if(message === "move"){
                    moveRandom(bot)
                }
            })

        }));

        console.info(`Processed ${success}/${loginData.length} sessions.`);
    }
})();
