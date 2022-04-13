import { ApolloServer } from "apollo-server";
import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { ApiConfig } from "./config/ApiConfig";
import { Health, HealthStatus } from "./model/Health";
import { Database } from "./repository/config/Database";
import { AmenityResolver } from "./resolver/AmenityResolver";
import { AmenityTypeResolver } from "./resolver/AmenityTypeResolver";
import { FacilityResolver } from "./resolver/FacilityResolver";
import { NotificationResolver } from "./resolver/NotificationResolver";
import { OperationResolver } from "./resolver/OperationResolver";
import { OperationTypeResolver } from "./resolver/OperationTypeResolver";
import { SpaceResolver } from "./resolver/SpaceResolver";
import { SpaceTypeResolver } from "./resolver/SpaceTypeResolver";
import { TransportationResolver } from "./resolver/TransportationResolver";
import { TransportationTypeResolver } from "./resolver/TransportationTypeResolver";
import { ErrorHandlerService } from "./service/ErrorHandlerService";
import { HealthCheckService } from "./service/HealthCheckService";
import { logging } from "./util/log/LogManager";

export class ApiServer {

    private static instance: ApiServer;

    private server: ApolloServer;
    private db: Database;
    private config: ApiConfig;

    private logger = logging.getLogger(ApiServer.name);

    private constructor(config: ApiConfig) {
        this.config = config;
        this.db = Database.getInstance(config.db);
        this.logger.debug("Starting Server with config: " + JSON.stringify(this.config, null, 2));
    }

    /**
     * Bootstraps the Api Server.
     */
    async start(): Promise<string> {
        await this.db.connect();
        return await this.bootstrapGraphql();
    }

    static getInstance(config: ApiConfig): ApiServer {
        return this.instance ? this.instance : new this(config);
    }

    /**
     * Stop the server, clean up.
     */
    async stop(): Promise<void> {
        await this.db.disconnect();
        if (this.server) {
            await this.server.stop();
        }
    }


    /**
     * Starts the GraphQL Server.
     */
    private async bootstrapGraphql(): Promise<string> {


        const schema = await this.buildApiSchema();


        this.server = new ApolloServer({

            schema,
            playground: this.config.server.env != "production",
            onHealthCheck: (req) => {
                return new Promise(async (resolve, reject) => {
                    const health: Health = await HealthCheckService.checkHealth();
                    this.logger.debug(JSON.stringify(health));
                    if (health.status == HealthStatus.UP) {
                        resolve("success");
                    } else {
                        reject();
                    }
                });
            },
            formatError: (error) => {
                return ErrorHandlerService.processError(error);
            },
        });
        const port = this.config.server.port || 0;
        const { server, url } = await this.server.listen(port);
        this.logger.info(`Server is running at: ${url}`);
        server.keepAliveTimeout = 30000;
        return url;
    }

    /**
     * Builds GraphQLSchema for the API.
     */
    private async buildApiSchema(): Promise<GraphQLSchema> {
        const schema = await buildSchema({
            resolvers: [FacilityResolver, TransportationResolver, TransportationTypeResolver, AmenityTypeResolver, AmenityResolver,
                OperationResolver, OperationTypeResolver, SpaceTypeResolver, SpaceResolver, NotificationResolver

            ],
            validate: true,
        });
        return schema;

    }
}