export declare class Driver {
    id: number;
    fullName: string;
    username: string;
    password: string;
    email?: string;
    phone?: string;
    licenseNumber?: string;
    age: number;
    status: 'active' | 'inactive';
    currentLatitude?: number;
    currentLongitude?: number;
    lastLocationUpdate?: Date;
    nidImage?: string;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
