import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Setting {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => User, user => user.setting)
    user: User
}