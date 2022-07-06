import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({name: 'room_join'})
export class RoomJoin {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Room, room => room.room_join)
    room?: Room;
    
    @ManyToOne(() => User, user => user.room_join)
    user?: User;

    @Column()
    status: string;

    @CreateDateColumn()
    created_at?: Date;
}