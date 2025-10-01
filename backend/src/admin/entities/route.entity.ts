import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('routes')
export class RouteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  startLocation: string;

  @Column({ length: 100 })
  endLocation: string;

  @Column('text', { array: true })
  stops: string[];

  @Column('decimal', { precision: 5, scale: 2 })
  distance: number;

  @Column('int')
  estimatedDuration: number; // in minutes

  @Column('decimal', { precision: 6, scale: 2 })
  fare: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}