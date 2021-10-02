import {SessionData} from "../@types/sessionData";
import {generateBotConfigs} from "./generateBotConfigs";


export const generateSessionData = async (sessions: any, totalUsers: any, host: any, port: number) => {
    const botsPerSession = Math.floor(totalUsers / sessions);
    let sessionData: SessionData[] = [];

    const leftoverUsers = totalUsers % botsPerSession;

    for (let idx = 0; idx < sessions; idx++) {
        //If we have more than 1 session and we have an odd number of sessions add an extra bot to the first one
        const amount = (idx == 0 && (leftoverUsers > 0)) ? (botsPerSession + leftoverUsers) : botsPerSession;
        sessionData.push({amount: amount, data: await generateBotConfigs(amount, host, port)});
    }

    return sessionData;
}