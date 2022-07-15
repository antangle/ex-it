import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'auth'})
@Index(["email", "type"], { unique: true })
export class Auth {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User, (user) => user.auth, { onDelete: 'CASCADE' })
    user?: User;

    @Column()
    userId?: number;

    @Column()
    email?: string;

    @Column()
    type?: string;

    @Column({
        nullable: true,
    })
    oauth_refresh_token?: string;
}