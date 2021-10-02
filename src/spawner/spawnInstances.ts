import {ChildProcess, exec} from "child_process";
import {SessionData} from "../@types/sessionData";

export const spawnInstances = async (spawnData: SessionData[], wait?: number) => {
    wait = wait as number ?? 5000;
    const processes: { process: ChildProcess, content: string }[] = [];

    for (let index = 0; index < spawnData.length; index++) {
        await (async (index) => {
            const {data} = spawnData[index];
            const child = exec(`yarn run start --child --data=${Buffer.from(JSON.stringify(data)).toString('base64')}`);
            if (!child) return
            // Add the child process to the list for tracking
            processes.push({process: child, content: ""});

            // Listen for any response:
            child.stdout?.on('data', (consoleData) => {

                console.log(child.pid, consoleData);
                processes[index].content += consoleData;
            });

            // Listen for any errors:
            child.stderr?.on('data', (consoleData) => {
                console.log(child.pid, consoleData);
                processes[index].content += consoleData;
            });

            // Listen if the process closed
            child.on('close', function (exit_code) {
                console.log('Closed before stop: Closing code: ', exit_code);
            });
        })(index)
        await sleep(wait);
    }
}

async function sleep(ms: number): Promise<void> {
    let promise: Promise<void> = new Promise<void>((resolve) => {
        setTimeout(() => {resolve();}, ms);
    });
    return promise;
}