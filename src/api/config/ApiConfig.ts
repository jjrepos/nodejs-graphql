
export interface ApiConfig {
    readonly server: {
        port: number,
        env: string
    },
    logLevels: LogLevels,
    readonly db: DBConfig;
}

export interface DBConfig {
    hosts: string,
    dbName: string,
    replicaSet: string,
    user: string,
    password: string,
    poolSize: number,
    debug: boolean,
    authSource: string
}

export interface LogLevels { [module: string]: string }
