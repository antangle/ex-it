import { Tag } from './tag.entity';
import { Room } from './room.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity({name: 'room_tag'})
export class RoomTag {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Room, room => room.room_tag)
    room?: Room;
    
    @ManyToOne(() => Tag, tag => tag.room_tag)
    tag?: Tag;
}