import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Setting } from './setting.entity';
import { User } from './user.entity';

@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id?: number;

    // @Column()
    // user?: User

    // @Column()
    // settings?: Setting

    @Column()
    type?: string

    @Column()
    access_token?: string

    @Column()
    refresh_token?: string
}