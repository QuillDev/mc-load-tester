import {BotOptions, createBot} from "mineflayer";
import {generateNewName, loadWords} from "./src/names/names";
import {KickReason} from "./types/kickReason";
import {loadConfig} from "./src/config/loadConfig";


export const loginBot = async (config: BotOptions) => {

    const bot = createBot(config);
    let name = config.username;

    bot.once('spawn', async () => {
        bot.chat("Hello!");
        console.info(`Bot ${name} has connected to ${config.port}`);
    });

    bot.on("windowOpen", (window) => {

        //TODO: Move somewhere else
        const teamSlots = [1, 3, 5, 7];
        const titleObject = JSON.parse(window.title);

        if (titleObject.text === "Choose your team") {
            bot.clickWindow(5, 0, 0);
        } else if (titleObject.text === "Choose your class!") {
            let slot = teamSlots[Math.round(Math.random() * (teamSlots.length - 1))];
            bot.clickWindow(slot, 0, 0);
        }
    })

    bot.on('kicked', (kickReason) => {
        const reason: KickReason = JSON.parse(kickReason);
        console.error(`Bot ${name} was kicked. -> Reason: ${reason.text ?? "Unknown Reason"}`)
    });
    bot.on('error', (err) => {
        console.error(`Bot ${name} experienced an error!\n${err.stack}`)
    });
}

(async () => {

    const config = await loadConfig("./config.json");
    await loadWords(config.namePath);

    const hostName: string = config.hostname ?? "localhost";
    const port: number = config.port ?? 25565;


    const configs: BotOptions[] = [];
    for (let idx = 0; idx < config.amount; idx++) {
        let name = generateNewName();
        configs.push(
            {
                "host": hostName,
                "port": port,
                "username": await name
            }
        );
    }

    configs.map(async (config) => loginBot(config))
})();


