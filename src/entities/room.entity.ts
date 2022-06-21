import { RoomTag } from './roomTag.entity';
import { RoomJoin } from './roomJoin.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id?: number;
  
  @ManyToOne(() => User)
  create_user?: User

  @OneToMany(() => RoomJoin, roomJoin => roomJoin.room)
  roomJoin?: RoomJoin;

  @OneToMany(() => RoomTag, roomTag => roomTag.room)
  roomTag?: RoomTag;

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
  
  @Column()
  hardcore?: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @Column()
  observer?: boolean;
}