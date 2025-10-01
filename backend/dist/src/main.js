"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: [
                'http://localhost:8000',
                'http://localhost:3000',
                'http://localhost:3001',
                'https://dhaka-bus-service-oaw75q4uk-raihan-de930adc.vercel.app',
                'https://dhaka-bus-service-p7t6lws4c-raihan-de930adc.vercel.app',
                'https://dhaka-bus-service-7rj10lg9o-raihan-de930adc.vercel.app',
                /\.vercel\.app$/,
                /\.railway\.app$/,
                ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        });
        app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
            prefix: '/uploads/',
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: false,
        }));
        const port = process.env.PORT ?? 3000;
        console.log('🚀 Backend server starting on port', port);
        await app.listen(port, '0.0.0.0');
        console.log(`✅ Backend server is running on port ${port}`);
        setInterval(() => {
            console.log('🔄 Server health check - still running...');
        }, 30000);
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('🚫 Uncaught Exception thrown:', error);
    process.exit(1);
});
bootstrap();
//# sourceMappingURL=main.js.map