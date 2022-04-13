import { ApiServer } from "./ApiServer";
import { ApiConfig } from "./config/ApiConfig";
import { logging } from "./util/log/LogManager";
//import { DataLoader } from "./repository/data/DataLoader";

async function bootstrap() {
    const apiConfig: ApiConfig = require("../settings/settings.json");
    process.env.NODE_ENV = apiConfig.server.env;

    logging.configure({ minLevels: apiConfig.logLevels })
        .registerConsoleLogger();

    const server = ApiServer.getInstance(apiConfig);
    await server.start();

    // Seed Database - use only for local

    /*
    const dataLoader = new DataLoader();
    await dataLoader.seedDatabase();
    */


    process.on('SIGINT', async function () {
        process.exit();
    });
    process.on('exit', async (code) => {
        await server.stop();
    });
}



bootstrap();

