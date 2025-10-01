"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const route_service_1 = require("../src/admin/services/route.service");
async function testRoutes() {
    try {
        console.log('🔍 Testing Route API...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const routeService = app.get(route_service_1.RouteService);
        console.log('✅ Application started successfully');
        const routes = await routeService.findAll();
        console.log('📍 Routes found:', routes.length);
        routes.forEach((route, index) => {
            console.log(`${index + 1}. ${route.name} - ${route.startLocation} to ${route.endLocation} (₹${route.fare})`);
        });
        await app.close();
        console.log('✅ Test completed successfully');
    }
    catch (error) {
        console.error('❌ Error testing routes:', error);
    }
}
testRoutes();
//# sourceMappingURL=test-routes.js.map