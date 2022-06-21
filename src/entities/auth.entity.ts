import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => User, (user) => user.auth)
    user?: User

    @Column()
    type?: string

    @Column()
    access_token?: string

    @Column()
    refresh_token?: string
}