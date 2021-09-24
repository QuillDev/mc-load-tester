export interface LoadTesterConfig {

}

export class LoadTesterConfig {

    constructor(
        public amount: number,
        public hostname: string,
        public port: number,
        public namePath: string,
    ) {
    }

}
