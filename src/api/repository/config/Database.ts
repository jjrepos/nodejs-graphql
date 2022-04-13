import { mongoose } from "@typegoose/typegoose";
import { DBConfig } from "../../config/ApiConfig";
import { logging } from "../../util/log/LogManager";

export class Database {

    private static instance: Database;

    private config: DBConfig;
    private logger = logging.getLogger(Database.name);

    private constructor(config: DBConfig) {
        this.config = config;
    }

    async connect(): Promise<void> {
        let dbUrl = "";
        if (this.config.user !== "" && this.config.authSource !== "") {
            dbUrl = `mongodb://${this.config.user}:${this.config.password}@${this.config.hosts}/${this.config.dbName}?replicaSet=${this.config.replicaSet}&authSource=${this.config.authSource}`;
        } else {
            dbUrl = `mongodb://${this.config.hosts}/${this.config.dbName}?replicaSet=${this.config.replicaSet}`;
        }
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: this.config.dbName,
            poolSize: this.config.poolSize,
            bufferCommands: false,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: true,
            bufferMaxEntries: 0,
            connectTimeoutMS: 1000,
            socketTimeoutMS: 30000
        };

        if (!dbUrl) {
            this.logger.error('DB connection info is missing from the settings -  exiting now...');
            process.exit(1);
        }

        this.logger.debug(`Eshtablishing connection to DB: ${dbUrl}...`);
        await mongoose.connect(dbUrl, options)
            .catch(err => {
                this.logger.error(`Could not connect to DB: ${dbUrl}  exiting now...`, err);
                process.exit(1);
            });
        this.logger.info(`Successfully connected to DB: ${dbUrl}`);
        mongoose.set('debug', this.config.debug);
        mongoose.set('useFindAndModify', false);
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }

    static getInstance(config: DBConfig): Database {
        return this.instance ? this.instance : new this(config);
    }
}