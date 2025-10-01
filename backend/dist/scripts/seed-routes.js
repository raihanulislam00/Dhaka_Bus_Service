"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const route_service_1 = require("../src/admin/services/route.service");
async function seedRoutes() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const routeService = app.get(route_service_1.RouteService);
    const sampleRoutes = [
        {
            name: 'Gulshan to Dhanmondi Express',
            startLocation: 'Gulshan Circle 1',
            endLocation: 'Dhanmondi 27',
            stops: ['Gulshan 2', 'Banani', 'Mohakhali', 'Farmgate', 'Karwan Bazar', 'Dhanmondi 32'],
            distance: 15.5,
            estimatedDuration: 45,
            fare: 25.00,
            description: 'Express route connecting Gulshan to Dhanmondi via major commercial areas',
        },
        {
            name: 'Uttara to Motijheel Local',
            startLocation: 'Uttara Sector 3',
            endLocation: 'Motijheel',
            stops: ['Uttara Sector 7', 'Airport', 'Khilkhet', 'Mohakhali', 'Tejgaon', 'Ramna', 'Paltan'],
            distance: 28.2,
            estimatedDuration: 75,
            fare: 35.00,
            description: 'Local service from Uttara to Motijheel covering major stops',
        },
        {
            name: 'Old Dhaka Circular',
            startLocation: 'Sadarghat',
            endLocation: 'Chawkbazar',
            stops: ['Ahsan Manzil', 'Lalbagh', 'Nazimuddin Road', 'New Market'],
            distance: 8.3,
            estimatedDuration: 25,
            fare: 15.00,
            description: 'Circular route covering historic Old Dhaka area',
        }
    ];
    try {
        for (const routeData of sampleRoutes) {
            await routeService.create(routeData);
            console.log(`Created route: ${routeData.name}`);
        }
        console.log('✅ Sample routes created successfully');
    }
    catch (error) {
        console.error('❌ Error creating sample routes:', error);
    }
    finally {
        await app.close();
    }
}
seedRoutes();
//# sourceMappingURL=seed-routes.js.map