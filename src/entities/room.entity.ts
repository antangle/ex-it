import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id?: number;
  
  @Column()
  create_user_id?: User

  @Column()
  username?: string;

  @Column()
  max_occupancy?: number;

  @Column()
  current_occupancy?: number;
  
  @Column()
  state?: string;
  
  @Column()
  communication?: string;
  
  @Column({
    type: 'datetime'
  })
  hardcore?: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @Column()
  observer?: boolean;
}