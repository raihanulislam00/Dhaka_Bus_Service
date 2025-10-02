"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const passenger_controller_1 = require("./passenger.controller");
const passenger_service_1 = require("./passenger.service");
const email_service_1 = require("./services/email.service");
const route_service_1 = require("../admin/services/route.service");
const schedule_service_1 = require("../admin/services/schedule.service");
const passenger_entities_1 = require("./entities/passenger.entities");
const ticket_entity_1 = require("./entities/ticket.entity");
const route_entity_1 = require("../admin/entities/route.entity");
const schedule_entity_1 = require("../admin/entities/schedule.entity");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let PassengerModule = class PassengerModule {
};
exports.PassengerModule = PassengerModule;
exports.PassengerModule = PassengerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([passenger_entities_1.Passenger, ticket_entity_1.Ticket, route_entity_1.RouteEntity, schedule_entity_1.ScheduleEntity]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: 'your-secret-key',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [passenger_controller_1.PassengerController],
        providers: [passenger_service_1.PassengerService, jwt_strategy_1.JwtStrategy, email_service_1.EmailService, route_service_1.RouteService, schedule_service_1.ScheduleService]
    })
], PassengerModule);
//# sourceMappingURL=passenger.module.js.map