import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'alarm'})
export class Alarm {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => User)
    user?: User

    @Column()
    talk_alert?: boolean

    @Column()
    feedback_alert?: boolean

    @Column()
    notice_alert?: boolean

    @Column()
    email_alert?: boolean
}