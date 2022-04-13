import { Health, HealthStatus } from "../model/Health";
import { HealthComponent } from "../model/HealthComponent";
import { mongoose } from "@typegoose/typegoose";

export class HealthCheckService {

    public static async checkHealth(): Promise<Health> {
        let components: HealthComponent[] = [];
        let dbComponent: HealthComponent = await this.dbHealthCheck();
        components.push(dbComponent);
        return new Health(this.getHealthStatus(components), components);
    }

    private static async dbHealthCheck(): Promise<HealthComponent> {
        let name: string = "db";
        let details: any;
        let status: HealthStatus;
        try{
            let dbConnection = mongoose.connection;
            details = await dbConnection.db.stats();
        } catch(error) {
            details = error;
        }
        if(details.ok) {
            status = HealthStatus.UP;
        } else {
            status = HealthStatus.DOWN;
        }
        return new HealthComponent(name, status, details);
    }

    private static getHealthStatus(components: HealthComponent[]): HealthStatus {
        let status: HealthStatus = HealthStatus.UP;
        for(let i = 0; i <= components.length -1; i++) {
            if(components[i].status == HealthStatus.DOWN) {
                status = HealthStatus.DOWN;
                break;
            }
        };
        return status;
    }
}