"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const route_service_1 = require("./services/route.service");
const schedule_service_1 = require("./services/schedule.service");
const admin_jwt_strategy_1 = require("./strategies/admin-jwt.strategy");
const path_1 = require("path");
const serve_static_1 = require("@nestjs/serve-static");
const typeorm_1 = require("@nestjs/typeorm");
const admin_entity_1 = require("./entities/admin.entity");
const route_entity_1 = require("./entities/route.entity");
const schedule_entity_1 = require("./entities/schedule.entity");
const driver_1 = require("../driver/entities/driver");
const driver_service_1 = require("../driver/driver.service");
const passenger_entities_1 = require("../passenger/entities/passenger.entities");
const ticket_entity_1 = require("../passenger/entities/ticket.entity");
const passenger_service_1 = require("../passenger/passenger.service");
const email_service_1 = require("../passenger/services/email.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([admin_entity_1.AdminEntity, route_entity_1.RouteEntity, schedule_entity_1.ScheduleEntity, driver_1.Driver, passenger_entities_1.Passenger, ticket_entity_1.Ticket]),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'your-secret-key',
                signOptions: { expiresIn: '1h' },
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'uploads'),
                serveRoot: '/uploads',
            }),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, route_service_1.RouteService, schedule_service_1.ScheduleService, driver_service_1.DriverService, passenger_service_1.PassengerService, email_service_1.EmailService, admin_jwt_strategy_1.AdminJwtStrategy]
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map