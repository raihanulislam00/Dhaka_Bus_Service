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

  @Column({ type: 'varchar', length: 10 })
  departureTime: string;

  @Column({ type: 'varchar', length: 10 })
  arrivalTime: string;

  @Column({ type: 'varchar', length: 20 })
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