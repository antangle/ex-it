import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Auth } from './auth.entity';
import { Setting } from './setting.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    setting?: Setting

    @Column()
    auth?: Auth

    @Column()
    email?: string;

    @Column()
    password?: string;

    @Column()
    nickname?: string;

    @Column()
    name?: string;

    @Column()
    phone?: string;

    @Column({
        type: 'datetime'
    })
    birth?: string;

    @Column()
    sex?: string;

    @Column()
    terms?: boolean;

    @Column()
    personal_info_terms?: boolean;

    @Column({
        default: false
    })
    is_identified?: boolean;

    @CreateDateColumn()
    created_at?: Date

    @UpdateDateColumn()
    updated_at?: Date

    @Column()
    temp_uuid?: string

    @Column()
    token?: string

    @Column()
    profile_url?: string
}