import { Review } from './review.entity';
import { RoomTag } from './roomTag.entity';
import { RoomJoin } from './roomJoin.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinTable, ManyToOne, OneToMany, DeleteDateColumn, VersionColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity({name: 'room'})
export class Room {
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiHideProperty()
  @ManyToOne(() => User)
  create_user?: User
  
  @ApiHideProperty()
  @OneToMany(() => RoomJoin, roomJoin => roomJoin.room)
  room_join?: RoomJoin;
  
  @ApiHideProperty()
  @OneToMany(() => RoomTag, roomTag => roomTag.room)
  room_tag?: RoomTag;
  
  @ApiHideProperty()
  @OneToMany(() => Review, review => review.room)
  review?: Review;
  
  @Column()
  title?: string;

  @Column({
    unique: true
  })
  roomname?: string;

  @Column({
    nullable: true
  })
  speakerId?: number;

  @Column()
  nickname?: string;

  @Column()
  hardcore?: boolean;

  @CreateDateColumn({type: 'timestamptz'})
  created_at?: Date;

  @Column()
  guest?: boolean;

  @ApiHideProperty()
  //checks if this room is online
  @Column({
    nullable: true,
    default: true
  })
  is_online?: boolean = true;

  @ApiHideProperty()
  //checks if this room is occupied
  @Column({
    nullable: true,
    type: 'timestamptz'
  })
  is_occupied?: Date = null;
  
  @ApiHideProperty()
  @VersionColumn({
    default: 0,
    nullable: true
  })
  version?: number;

}