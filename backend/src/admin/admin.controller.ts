import { 
  Body, Controller, Delete, Get, HttpCode, HttpStatus, 
  Param, ParseIntPipe, Post, Put, Query, UsePipes, 
  ValidationPipe, UploadedFile, UseInterceptors, 
  BadRequestException, Patch, UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { AdminService } from './admin.service';
import { RouteService } from './services/route.service';
import { ScheduleService } from './services/schedule.service';
import { DriverService } from '../driver/driver.service';
import { PassengerService } from '../passenger/passenger.service';
import * as Express from 'express';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AdminExistPipe } from './pipes/admin-exist.pipe';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';
import { AdminEntity } from './entities/admin.entity';
import { RouteEntity } from './entities/route.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { ParseDatePipe } from './pipes/parse-date.pipe';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminservice: AdminService,
    private readonly routeService: RouteService,
    private readonly scheduleService: ScheduleService,
    private readonly driverService: DriverService,
    private readonly passengerService: PassengerService,
  ) {}

  @Get()
  async findAll(): Promise<AdminEntity[]> {
    return this.adminservice.findAll(); 
  }

    @Get('defaultCountry')
  async findWithDefaultCountry(): Promise<AdminEntity[]> {
    return this.adminservice.findWithDefaultCountry();
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true, 
      disableErrorMessages: false,
    })
  )
  async create(
    @Body() createAdminData: CreateAdminDto
  ): Promise<AdminEntity> {
    return this.adminservice.create(createAdminData);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true, 
      disableErrorMessages: false,
    })
  )
  async update(
    @Param('id', ParseIntPipe, AdminExistPipe) id: number,
    @Body() updateAdminData: UpdateAdminDto,
  ): Promise<AdminEntity> {
    return this.adminservice.update(id, updateAdminData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe, AdminExistPipe) id: number
  ): Promise<void> {
    await this.adminservice.remove(id);
  }

  @Patch(':id/country')
  @HttpCode(HttpStatus.OK)
  async updateCountry(
    @Param('id', ParseIntPipe, AdminExistPipe) id: number,
    @Body('country') country: string
  ): Promise<AdminEntity> {
    return this.adminservice.updateCountry(id, country);
  }

  @Get('byJoiningDate/:date')
  async findByJoiningDate(
    @Param('date', ParseDatePipe) date: Date
  ): Promise<AdminEntity[]> {
    return this.adminservice.findByJoiningDate(date);
  }

  @Post('registerWithPhoto')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true, 
      disableErrorMessages: false,
    })
  )
  @UseInterceptors(FileInterceptor('photo', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 },
    storage: diskStorage({
      destination: './uploads/photos',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    })
  }))
  async createWithPhoto(
    @UploadedFile() photo: any,
    @Body() createAdminData: CreateAdminDto,
  ): Promise<AdminEntity> {
    const newAdmin = await this.adminservice.create(createAdminData);
    
    if (photo) {
      return this.adminservice.updatePhotoPath(newAdmin.id, photo.filename);
    }
    
    return newAdmin;
  }

  // Authentication endpoints
  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminservice.login(loginAdminDto);
  }

  // Route Management Endpoints
  @Post('routes')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createRoute(@Body() createRouteDto: CreateRouteDto): Promise<RouteEntity> {
    return this.routeService.create(createRouteDto);
  }

  @Get('routes')
  async findAllRoutes(): Promise<RouteEntity[]> {
    return this.routeService.findAll();
  }

  @Get('routes/search')
  async searchRoutes(
    @Query('start') startLocation?: string,
    @Query('end') endLocation?: string,
  ): Promise<RouteEntity[]> {
    return this.routeService.findByLocation(startLocation, endLocation);
  }

  @Get('routes/active')
  async findActiveRoutes(): Promise<RouteEntity[]> {
    return this.routeService.findActive();
  }

  @Get('routes/:id')
  async findOneRoute(@Param('id', ParseIntPipe) id: number): Promise<RouteEntity> {
    return this.routeService.findOne(id);
  }

  @Put('routes/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateRoute(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRouteDto: UpdateRouteDto,
  ): Promise<RouteEntity> {
    return this.routeService.update(id, updateRouteDto);
  }

  @Delete('routes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRoute(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.routeService.remove(id);
  }

  @Patch('routes/:id/toggle')
  async toggleRouteActive(@Param('id', ParseIntPipe) id: number): Promise<RouteEntity> {
    return this.routeService.toggleActive(id);
  }

  // Schedule Management Endpoints
  @Post('schedules')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createSchedule(@Body() createScheduleDto: CreateScheduleDto): Promise<ScheduleEntity> {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get('schedules')
  async findAllSchedules(): Promise<ScheduleEntity[]> {
    return this.scheduleService.findAll();
  }

  @Get('schedules/route/:routeId')
  async findSchedulesByRoute(@Param('routeId', ParseIntPipe) routeId: number): Promise<ScheduleEntity[]> {
    return this.scheduleService.findByRoute(routeId);
  }

  @Get('schedules/available')
  async findAvailableSchedules(): Promise<ScheduleEntity[]> {
    return this.scheduleService.findAvailableForDriver();
  }

  @Get('schedules/:id')
  async findOneSchedule(@Param('id', ParseIntPipe) id: number): Promise<ScheduleEntity> {
    return this.scheduleService.findOne(id);
  }

  @Put('schedules/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleEntity> {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete('schedules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSchedule(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.scheduleService.remove(id);
  }

  @Patch('schedules/:id/assign-driver/:driverId')
  async assignDriverToSchedule(
    @Param('id', ParseIntPipe) scheduleId: number,
    @Param('driverId', ParseIntPipe) driverId: number,
  ): Promise<ScheduleEntity> {
    return this.scheduleService.assignDriver(scheduleId, driverId);
  }

  @Patch('schedules/:id/unassign-driver')
  async unassignDriverFromSchedule(@Param('id', ParseIntPipe) scheduleId: number): Promise<ScheduleEntity> {
    return this.scheduleService.unassignDriver(scheduleId);
  }

  @Patch('schedules/:id/toggle')
  async toggleScheduleActive(@Param('id', ParseIntPipe) id: number): Promise<ScheduleEntity> {
    return this.scheduleService.toggleActive(id);
  }

  // Driver Management Endpoints (for Admin)
  @Get('drivers')
  async getAllDrivers() {
    return this.driverService.findAllDrivers();
  }

  @Get('drivers/active')
  async getAllActiveDrivers() {
    return this.driverService.findAllActiveDrivers();
  }

  @Get('drivers/with-location')
  async getAllDriversWithLocation() {
    return this.driverService.getAllDriversWithLocation();
  }

  @Patch('drivers/:id/status')
  async updateDriverStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: { status: 'active' | 'inactive' },
  ) {
    return this.driverService.updateDriverStatus(id, statusDto);
  }

  @Patch('drivers/:id/details')
  async updateDriverDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
  ) {
    return this.driverService.updateDriverDetails(id, updateData);
  }

  @Get('drivers/:id/location')
  async getDriverLocation(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.getDriverLocation(id);
  }

  // Passenger Management Endpoints (for Admin)
  @UseGuards(AdminJwtAuthGuard)
  @Get('passengers')
  async getAllPassengers() {
    return this.passengerService.findAll();
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('passengers/search')
  async searchPassengers(@Query('name') name: string) {
    if (!name || name.trim() === '') {
      return this.passengerService.findAll();
    }
    return this.passengerService.findByFullNameSubstring(name);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('passengers/:id')
  async getPassengerById(@Param('id', ParseIntPipe) id: number) {
    return this.passengerService.findById(id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get('passengers/:id/tickets')
  async getPassengerTickets(@Param('id', ParseIntPipe) passengerId: number) {
    return this.passengerService.getPassengerTickets(passengerId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch('passengers/:id/status')
  async updatePassengerStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: { isActive: boolean },
  ) {
    return this.passengerService.update(id, { isActive: statusDto.isActive });
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('passengers/:id')
  @HttpCode(HttpStatus.OK)
  async deletePassenger(@Param('id', ParseIntPipe) id: number) {
    const passenger = await this.passengerService.findById(id);
    return this.passengerService.removeByUsername(passenger.username);
  }

  // Admin-specific routes - these should come LAST to avoid conflicts
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe, AdminExistPipe) id: number
  ): Promise<AdminEntity> {
    return this.adminservice.findOne(id);
  }
}