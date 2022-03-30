import {BotOptions, Bot, createBot} from "mineflayer";
import {KickReason} from "../@types/kickReason";

export const login = async (config: BotOptions): Promise<Bot> => {

    const bot = createBot(config);
    let name = config.username;

    bot.once('spawn', async () => {
        console.info(`Bot ${name} has connected to ${config.port}`);
    });

    //TODO: Clean up
    bot.on('kicked', (kickReason) => {
        const reason: KickReason = JSON.parse(kickReason);
        console.error(`Bot ${name} was kicked. -> Reason: ${reason.text ?? "Unknown Reason"}`)
    });
    bot.on('error', (err) => {
        console.error(`Bot ${name} experienced an error!\n${err.stack}`)
    });

    return bot;
}