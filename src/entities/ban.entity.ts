import { Reply } from './reply.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'ban'})
export class Ban {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User, user => user.ban)
    user?: User;

    @ManyToOne(() => User)
    banned_user?: User;
}