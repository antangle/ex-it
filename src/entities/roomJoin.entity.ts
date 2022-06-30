import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({name: 'room_join'})
export class RoomJoin {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Room, room => room.roomJoin)
    room?: Room;
    
    @ManyToOne(() => User, user => user.roomJoin)
    user?: User;

    @Column()
    status: string;
    
    @Column()
    talk_time: number;
    
    @Column()
    call_time: number;
    
}