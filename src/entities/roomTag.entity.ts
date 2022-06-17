import { Tag } from './tag.entity';
import { Room } from './room.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RoomTag {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    tag?: Tag;

    @Column()
    room?: Room;
}