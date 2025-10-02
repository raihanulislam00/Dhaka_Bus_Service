"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const passenger_module_1 = require("./passenger/passenger.module");
const driver_module_1 = require("./driver/driver.module");
const admin_module_1 = require("./admin/admin.module");
const driver_1 = require("./driver/entities/driver");
const typeorm_1 = require("@nestjs/typeorm");
const passenger_entities_1 = require("./passenger/entities/passenger.entities");
const ticket_entity_1 = require("./passenger/entities/ticket.entity");
const admin_entity_1 = require("./admin/entities/admin.entity");
const route_entity_1 = require("./admin/entities/route.entity");
const schedule_entity_1 = require("./admin/entities/schedule.entity");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'dhaka-bus-service-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
            typeorm_1.TypeOrmModule.forRoot(process.env.DATABASE_URL
                ? {
                    type: 'postgres',
                    url: process.env.DATABASE_URL,
                    autoLoadEntities: true,
                    entities: [driver_1.Driver, passenger_entities_1.Passenger, ticket_entity_1.Ticket, admin_entity_1.AdminEntity, route_entity_1.RouteEntity, schedule_entity_1.ScheduleEntity],
                    synchronize: true,
                    ssl: { rejectUnauthorized: false },
                    retryAttempts: 5,
                    retryDelay: 3000,
                    logging: ['error'],
                    extra: {
                        ssl: {
                            rejectUnauthorized: false
                        }
                    },
                }
                : {
                    type: 'sqlite',
                    database: './dhaka_bus_service.sqlite',
                    autoLoadEntities: true,
                    entities: [driver_1.Driver, passenger_entities_1.Passenger, ticket_entity_1.Ticket, admin_entity_1.AdminEntity, route_entity_1.RouteEntity, schedule_entity_1.ScheduleEntity],
                    synchronize: true,
                    logging: process.env.NODE_ENV !== 'production',
                }),
            driver_module_1.DriverModule,
            passenger_module_1.PassengerModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map