import { Bot } from "mineflayer"
import { goals } from "mineflayer-pathfinder"
import v from "vec3"

class IterData {
    tries: number
    maxTries: number
    constructor(){
        this.tries = 0
        this.maxTries = 30
    }
}

export const getRandomLocation = async (bot: Bot, iter: IterData): Promise<goals.GoalNearXZ> => {
    const oldPos = bot.entity.position
    const x = oldPos.x + ((Math.random() * maxRandom) - maxRandom / 2.0)
    const z = oldPos.z + ((Math.random() * maxRandom) - maxRandom / 2.0)
    const location = bot.blockAt(v([x, oldPos.y - 2, z]))

    const goal = new goals.GoalNearXZ(x, z, 3)
    if(iter.maxTries === iter.tries){
        return goal
    }

    const name = location?.name
    if(name !== "glass"){
        iter.tries++
        return getRandomLocation(bot, iter)
    }

    console.log('it was glass')
    return goal
}

const maxRandom = 25
export const moveRandom = async (bot: Bot) => {
    const iter = new IterData()
    const goal = await getRandomLocation(bot, iter)

    console.log(`Moving ${bot.username} -> ${goal.x} ${goal.z} ${iter.tries}tries`)
    //Clean up bots that go afk
    const clearer = setTimeout(() => { moveRandom(bot) }, 3000);

    //Make the bots move and clear the timeout
    await bot.pathfinder.goto(goal).then(() => {
        clearTimeout(clearer)
        moveRandom(bot)
    }).catch((_) => {});
}