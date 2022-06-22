import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({name: 'room_join'})
export class RoomJoin {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    roomId!: number;

    @Column()
    userId!: number;

    @ManyToOne(() => Room, room => room.roomJoin)
    room?: Room;
    
    @ManyToOne(() => User)
    user?: User;
}