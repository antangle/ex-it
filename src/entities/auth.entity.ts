import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'auth'})
@Index(["email", "type"], { unique: true })
export class Auth {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User, (user) => user.auth)
    user?: User

    @Column()
    email?: string

    @Column()
    type?: string

    @Column()
    refresh_token?: string
}