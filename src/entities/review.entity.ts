import { ReviewMapper } from './reviewMapper.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({name: 'review'})
export class Review {
    @PrimaryGeneratedColumn()
    id?: number;

    @JoinColumn()
    @ManyToOne(() => ReviewMapper)
    reviewMapper?: ReviewMapper;

    @ManyToOne(() => Room, room => room.review)
    room?: Room;

    @ManyToOne(() => User)
    user?: User;

    @Column({
        nullable: true
    })
    userId?: number;

    @Column({
        nullable: true
    })
    roomId?: number;

    @Column({
        nullable: true
    })
    reviewMapperId?: number;
}