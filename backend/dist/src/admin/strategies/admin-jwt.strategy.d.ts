import { Strategy } from 'passport-jwt';
import { AdminService } from '../admin.service';
declare const AdminJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    private adminService;
    constructor(adminService: AdminService);
    validate(payload: any): Promise<{
        id: any;
        username: any;
        role: any;
    }>;
}
export {};
