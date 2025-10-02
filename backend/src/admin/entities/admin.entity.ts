import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Entity('admin')
export class AdminEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 150, unique: true })
    uniqueId: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    username: string;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    joiningDate: Date;
    
    @Column({ type: 'varchar', length: 30, default: 'Unknown' })
    country: string;
    
    @Column({ type: 'varchar', length: 50 })
    name: string;
    
    @Column({ type: 'varchar', length: 100 })   
    password: string;
    
    @Column({ type: 'varchar', length: 50 })    
    mail: string;
    
    @Column({ type: 'varchar', length: 200, nullable: true })
    socialMediaLink: string;
    
    @Column({ type: 'varchar', length: 200, nullable: true })
    photoPath?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    @BeforeInsert()
    async generateUuid() {
        if (!this.uniqueId) {
            this.uniqueId = uuidv4();
        }
        
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}