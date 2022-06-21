import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id?: number;

    // @Column()
    // user?: User

    @Column()
    title?: string

    @Column()
    content?: string

    @Column()
    score?: number
}