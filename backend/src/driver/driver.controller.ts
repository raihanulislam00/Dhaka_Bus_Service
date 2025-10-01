import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDriverDto } from './dto/login-driver.dto';
import { UpdateStatusDto } from './update-status.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterError } from 'multer';
import { Response } from 'express';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('file')
  @UseInterceptors(
    FileInterceptor('nidImage', {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|png)$/)) {
          return cb(
            new MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 },
      storage: diskStorage({
        destination: './uploads/nid',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async createDriver(
    @Body() driverDto: CreateDriverDto,
    @UploadedFile() nidImage: any,
  ) {
    if (!nidImage) {
      throw new BadRequestException('NID image is required and must be under 2MB');
    }
    driverDto.nidImage = nidImage.filename;
    return await this.driverService.createDriver(driverDto);
  }

  @Get(':id')
  getDriverById(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.findDriverById(id);
  }

  @Get()
  getAllDrivers() {
    return this.driverService.findAllDrivers();
  }

  @Get('active')
  getAllActiveDrivers() {
    return this.driverService.findAllActiveDrivers();
  }

  @Get('with-location')
  getAllDriversWithLocation() {
    return this.driverService.getAllDriversWithLocation();
  }

  @Get('nid/:name')
  getNidImage(@Param('name') name: string, @Res() res: Response) {
    return res.sendFile(name, { root: './uploads/nid' });
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.driverService.updateDriverStatus(id, dto);
  }

  @Get('inactive')
  getInactiveDrivers() {
    return this.driverService.getInactiveDrivers();
  }

  @Get('older-than/:age')
  getDriversOlderThan(@Param('age', ParseIntPipe) age: number) {
    return this.driverService.getDriversOlderThan(age);
  }

  // Authentication endpoints
  @Post('register')
  async register(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.register(createDriverDto);
  }

  @Post('login')
  async login(@Body() loginDriverDto: LoginDriverDto) {
    return this.driverService.login(loginDriverDto);
  }

  // Schedule Management for Drivers
  @Get('schedules/available')
  async getAvailableSchedules() {
    return this.driverService.getAvailableSchedules();
  }

  @Get(':id/schedules')
  async getDriverSchedules(@Param('id', ParseIntPipe) driverId: number) {
    return this.driverService.getDriverSchedules(driverId);
  }

  @Post(':driverId/schedules/:scheduleId/select')
  async selectSchedule(
    @Param('driverId', ParseIntPipe) driverId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ) {
    return this.driverService.selectSchedule(driverId, scheduleId);
  }

  @Post(':driverId/schedules/:scheduleId/unselect')
  async unselectSchedule(
    @Param('driverId', ParseIntPipe) driverId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ) {
    return this.driverService.unselectSchedule(driverId, scheduleId);
  }

  @Get('routes/all')
  async getAllRoutes() {
    return this.driverService.getAllRoutes();
  }

  // Location tracking endpoints
  @Patch(':id/location')
  async updateDriverLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() locationDto: UpdateLocationDto,
  ) {
    return this.driverService.updateDriverLocation(id, locationDto);
  }

  @Get(':id/location')
  async getDriverLocation(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.getDriverLocation(id);
  }

  // Admin endpoints for driver management
  @Patch(':id/details')
  async updateDriverDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
  ) {
    return this.driverService.updateDriverDetails(id, updateData);
  }
}
