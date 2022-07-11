import { Review } from './review.entity';
import { RoomTag } from './roomTag.entity';
import { RoomJoin } from './roomJoin.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinTable, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'room'})
export class Room {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User)
  create_user?: User

  @OneToMany(() => RoomJoin, roomJoin => roomJoin.room)
  room_join?: RoomJoin;

  @OneToMany(() => RoomTag, roomTag => roomTag.room)
  room_tag?: RoomTag;
  
  @OneToMany(() => Review, review => review.room)
  review?: Review;

  @Column()
  title?: string;

  @Column({
    unique: true
  })
  roomname?: string;

  @Column()
  nickname?: string;

  @Column()
  max_occupancy?: number;

  @Column()
  hardcore?: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @Column()
  observer?: number;

  @Column({
    nullable: true
  })
  talk_time?: number;
  
  @Column({
    nullable: true
  })
  call_time?: number;

  //checks if this room is online
  @Column({
    nullable: true,
    default: true
  })
  is_online?: boolean = true;

  //checks if this room is occupied
  @Column({
    nullable: true,
  })
  is_occupied?: Date = null;
}