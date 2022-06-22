import { Tag } from './tag.entity';
import { Room } from './room.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity({name: 'room_tag'})
export class RoomTag {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    roomId!: number;

    @Column()
    tagId!: number;

    @ManyToOne(() => Room, room => room.roomTag)
    room?: Room;
    
    @ManyToOne(() => Tag, tag => tag.roomTag)
    tag?: Tag;
}