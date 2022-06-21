import { Inquiry } from './inquiry.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Reply {
    @PrimaryGeneratedColumn()
    id?: number;

    // @Column()
    // inquiry?: Inquiry

    @Column()
    title?: string

    @Column()
    content?: string

    @Column()
    type?: string
}