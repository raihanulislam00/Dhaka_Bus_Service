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
            origin: ['http://localhost:8000', 'http://localhost:3001', 'http://localhost:3000'],
            credentials: true,
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
        console.log('🚀 Backend server starting on port 3000...');
        await app.listen(process.env.PORT ?? 3000, 'localhost');
        console.log('✅ Backend server is running on http://localhost:3000');
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