"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    try {
        console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
        console.log('🔧 Database URL exists:', !!process.env.DATABASE_URL);
        console.log('🔧 Starting NestJS application...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('✅ NestJS application created successfully');
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
        console.log('✅ CORS configured');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: false,
        }));
        console.log('✅ Global pipes configured');
        const port = process.env.PORT ?? 3000;
        console.log('🚀 Starting server on port:', port);
        console.log('🌍 Binding to 0.0.0.0 for Railway compatibility');
        await app.listen(port, '0.0.0.0');
        console.log(`🎉 Backend server is successfully running on port ${port}`);
        console.log(`🌐 Server available at: http://0.0.0.0:${port}`);
    }
    catch (error) {
        console.error('💥 Failed to start server:', error);
        console.error('📋 Error stack:', error.stack);
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