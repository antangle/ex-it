import { RoomTag } from './roomTag.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @OneToMany(() => RoomTag, roomTag => roomTag.tag)
    roomTag?: RoomTag;
  
    @Column()
    is_popular?: boolean;
}