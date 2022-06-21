import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity()
export class RoomJoin {
    @PrimaryGeneratedColumn()
    id?: number;

    // @Column()
    // room_id?: Room;

    // @Column()
    // user_id?: User;
}