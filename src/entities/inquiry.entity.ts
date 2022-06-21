import { Reply } from './reply.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Inquiry {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User)
    user?: User;

    @OneToOne(() => Reply, reply => reply.inquiry)
    reply: Reply;

    @Column()
    title?: string;

    @Column()
    content?: string;

    @Column()
    type?: string;
}