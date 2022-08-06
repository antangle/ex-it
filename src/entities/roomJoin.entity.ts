import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, Unique } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({name: 'room_join'})
@Index(["status", "userId", "roomId"], { unique: true })
export class RoomJoin {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Room, room => room.room_join)
    room?: Room;
    
    @ManyToOne(() => User, user => user.room_join)
    user?: User;

    @Column()
    status?: string;

    @Column()
    roomId?: number;

    @Column()
    userId?: number;
    
    @Column({
        default: 0
    })
    total_time?: number;
    
    @Column({
        default: 0
    })
    call_time?: number;

    @CreateDateColumn()
    created_at?: Date;
}