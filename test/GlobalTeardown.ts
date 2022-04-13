import { MongoMemoryReplSet } from "mongodb-memory-server";
import { ApiServer } from "../src/api/ApiServer";

const teardown = async () => {

    const server: ApiServer = (global as any).__SERVERINSTANCE
    server.stop();
    const mongoServer: MongoMemoryReplSet = (global as any).__MONGOINSTANCE;
    await mongoServer.stop().then(() => console.log("stopped mongodb..."))

}
module.exports = teardown;