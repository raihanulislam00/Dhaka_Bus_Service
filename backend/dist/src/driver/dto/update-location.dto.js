"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLocationDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateLocationDto {
    latitude;
    longitude;
}
exports.UpdateLocationDto = UpdateLocationDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Latitude must be a number' }),
    (0, class_validator_1.Min)(-90, { message: 'Latitude must be between -90 and 90' }),
    (0, class_validator_1.Max)(90, { message: 'Latitude must be between -90 and 90' }),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Longitude must be a number' }),
    (0, class_validator_1.Min)(-180, { message: 'Longitude must be between -180 and 180' }),
    (0, class_validator_1.Max)(180, { message: 'Longitude must be between -180 and 180' }),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "longitude", void 0);
//# sourceMappingURL=update-location.dto.js.map