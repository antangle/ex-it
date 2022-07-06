import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({name: 'review'})
export class Review {
    @PrimaryGeneratedColumn()
    id?: number;

    @JoinColumn()
    @OneToOne(() => Room, room => room.review)
    room?: Room;

    @ManyToOne(() => User)
    user?: User;

    @Column()
    title?: string;

    @Column({
        nullable: true
    })
    mode?: number;

    @Column({
        nullable: true
    })
    score?: number;    

}