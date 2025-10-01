export declare class AdminEntity {
    id: number;
    uniqueId: string;
    username: string;
    joiningDate: Date;
    country: string;
    name: string;
    password: string;
    mail: string;
    socialMediaLink: string;
    photoPath?: string;
    createdAt: Date;
    updatedAt: Date;
    generateUuid(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
