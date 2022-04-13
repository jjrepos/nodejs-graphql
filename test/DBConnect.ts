import { DBConfig } from "../src/api/config/ApiConfig";
import { Database } from "../src/api/repository/config/Database";

const dbName = `${process.env.DB_NAME}`;
const hosts = `${process.env.MONGO_HOSTS}`;
const replicaSet = `${process.env.REPLICA_SET}`;

const config: DBConfig = {
    "hosts": hosts,
    "dbName": dbName,
    "replicaSet": replicaSet,
    "user": "",
    "password": "",
    "poolSize": 1,
    "debug": false,
    "authSource":""
};

const db = Database.getInstance(config);

beforeAll(async () => {
    await db.connect();
});

afterAll(async () => {
    await db.disconnect();
});


jest.setTimeout(30000);


