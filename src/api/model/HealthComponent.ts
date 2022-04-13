import { HealthStatus } from "./Health";

export class HealthComponent {
    name: string;
    status: HealthStatus;
    details: any;

    constructor(name: string, status: HealthStatus, details: any) {
        this.name = name;
        this.status = status;
        this.details = details;
    }
}