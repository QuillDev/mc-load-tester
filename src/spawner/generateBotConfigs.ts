import {BotOptions} from "mineflayer";
import {generateNewName} from "../names/names";

export const generateBotConfigs = async (amount: number, host?: string, port?: number): Promise<BotOptions[]> => {
    const configs: BotOptions[] = [];
    for (let idx = 0; idx < amount; idx++) {

        let name = generateNewName();
        configs.push(
            {
                host: host ?? 'localhost',
                port: port ?? 25565,
                username: await name,
                viewDistance: 'tiny',
                skipValidation: true,
                // loadInternalPlugins: false,
                colorsEnabled: false,
                // chat: "disabled",
                // physicsEnabled: false,
                keepAlive: true
            }
        );
    }

    return configs;
}
