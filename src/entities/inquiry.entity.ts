import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Inquiry {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    user?: User

    @Column()
    title?: string

    @Column()
    content?: string

    @Column()
    type?: string
}