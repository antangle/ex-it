import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';

@Entity()
export class TimeSetter {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    start: number;

    @Column()
    end: number;
}