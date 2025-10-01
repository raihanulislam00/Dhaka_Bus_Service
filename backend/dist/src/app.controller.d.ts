import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
        environment: string;
        hasDatabase: boolean;
        port: string;
    };
    getEnvCheck(): {
        NODE_ENV: string;
        PORT: string;
        DATABASE_URL: string;
        timestamp: string;
    };
}
