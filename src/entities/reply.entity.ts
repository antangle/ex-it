import { Inquiry } from './inquiry.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';

@Entity()
export class Reply {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => Inquiry, inquiry => inquiry.reply)
    inquiry?: Inquiry;

    @Column()
    title?: string;

    @Column()
    content?: string;

    @Column()
    type?: string;
}