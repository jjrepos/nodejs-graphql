import { EventEmitter } from "events";
import { Logger } from "./Logger";

export class LogManager extends EventEmitter {
    private static dateFormat = new Intl.DateTimeFormat("en-us", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
        timeZone: "America/New_York"
    });

    private options: LogOptions = {
        minLevels: {
            "": "info"
        }
    };

    // Prevent the console logger from being added twice
    private consoleLoggerRegistered: boolean = false;

    public configure(options: LogOptions): LogManager {
        this.options = Object.assign({}, this.options, options);
        return this;
    }

    public getLogger(module: string): Logger {
        let minLevel = "none";
        let match = "";
        for (const key in this.options.minLevels) {
            if (module.startsWith(key) && key.length >= match.length) {
                minLevel = this.options.minLevels[key];
                match = key;
            }
        }

        return new Logger(this, module, minLevel);
    }

    public onLogEntry(listener: (logEntry: LogEntry) => void): LogManager {
        this.on("log", listener);
        return this;
    }

    public async registerConsoleLogger(): Promise<LogManager> {
        if (this.consoleLoggerRegistered) return this;

        this.onLogEntry((logEntry) => {
            let now = new Date();
            const msg = `${LogManager.dateFormat.format(now)}  ${logEntry.level.toUpperCase()}  [${logEntry.module}] ${logEntry.message}`;
            switch (logEntry.level) {
                case "trace":
                    console.trace(msg);
                    break;
                case "debug":
                    console.debug(msg);
                    break;
                case "info":
                    console.info(msg);
                    break;
                case "warn":
                    console.warn(msg);
                    break;
                case "error":
                    console.error(msg, logEntry.error);
                    break;
                default:
                    console.log(`${LogManager.dateFormat.format(now)} ${logEntry.level} ${msg}`);
            }
        });

        this.consoleLoggerRegistered = true;
        return this;
    }
}

export interface LogEntry {
    level: string;
    module: string;
    message: string;
    error?: Error;
}

export interface LogOptions {
    minLevels: { [module: string]: string; };
}

export const logging = new LogManager();
