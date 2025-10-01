import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn({type:'int'})
  id: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  licenseNumber?: string;

  @Column({ type: 'int', unsigned: true })
  age: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'inactive',
  })
  status: 'active' | 'inactive';

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  currentLatitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  currentLongitude?: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLocationUpdate?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nidImage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
