import { MongoMemoryReplSet } from "mongodb-memory-server";
import { connect, connection, disconnect } from "mongoose";
import { ApiServer } from "../src/api/ApiServer";
import { ApiConfig } from "../src/api/config/ApiConfig";

const setup = async () => {
    const dbName = "facilities-api";
    const replicaSetName = "testtest";
    const mongoServer = new MongoMemoryReplSet({
        replSet: { name: replicaSetName, storageEngine: "wiredTiger", dbName: dbName }
    });
    await mongoServer.waitUntilRunning();
    console.log("Started mongodb...");
    const uri = await mongoServer.getUri();
    const hosts = uri.split("\//")[1].split("\/")[0];
    console.log("hosts: %s", hosts);

    (global as any).__MONGOINSTANCE = mongoServer;
    process.env.MONGO_URI = uri;
    process.env.DB_NAME = dbName;
    process.env.REPLICA_SET = replicaSetName;
    process.env.MONGO_HOSTS = hosts;
    process.env.NODE_ENV = "test";

    console.log(`Connecting to: ${process.env.MONGO_URI} to clean up for tests...`);
    await connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true });
    await connection.db.dropDatabase();
    await disconnect();
    console.log("Completed clean up...");

    const config: ApiConfig = {
        "server": {
            "port": 0,
            "env": "test"
        },
        "db": {
            "hosts": hosts,
            "dbName": dbName,
            "replicaSet": replicaSetName,
            "user": "",
            "password": "",
            "poolSize": 3,
            "debug": false,
            "authSource":""
        },
        "logLevels": {
            "Database": "debug",
            "ApiServer": "info",
            "Transaction": "trace",
            "": "info"
        }
    }

    const server = ApiServer.getInstance(config);
    const apiUrl = await server.start();
    (global as any).__SERVERINSTANCE = server;
    process.env.API_URL = apiUrl;
    console.log(`apiUrl: ${apiUrl}`);

};


module.exports = setup;
