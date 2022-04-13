import { HealthComponent } from "./HealthComponent";

export enum HealthStatus {
    UP = "UP",
    DOWN = "DOWN"
}

export class Health {
    status: HealthStatus;
    components?: HealthComponent[];

    constructor(status: HealthStatus = HealthStatus.UP, components?: HealthComponent[]) {
        this.status = status;
        this.components = components;
    }
}