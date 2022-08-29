import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, Index, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'auth'})
@Index(["email", "type"], { unique: true , where: 'deleted_at IS NULL'})
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

    @CreateDateColumn({type: 'timestamptz'})
    created_at?: Date;

    @DeleteDateColumn({type: 'timestamptz'})
    deleted_at?: Date;
}