import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RouteEntity } from './route.entity';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routeId: number;

  @ManyToOne(() => RouteEntity)
  @JoinColumn({ name: 'routeId' })
  route: RouteEntity;

  @Column({ length: 50 })
  busNumber: string;

  @Column('time')
  departureTime: string;

  @Column('time')
  arrivalTime: string;

  @Column({ type: 'enum', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] })
  dayOfWeek: string;

  @Column('int', { default: 45 })
  totalSeats: number;

  @Column('int', { default: 45 })
  availableSeats: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('text', { nullable: true })
  notes: string;

  @Column('int', { nullable: true })
  assignedDriverId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}