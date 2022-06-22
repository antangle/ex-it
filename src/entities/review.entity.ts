import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'review'})
export class Review {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User)
    user?: User

    @Column()
    title?: string

    @Column()
    content?: string

    @Column()
    score?: number
}