import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class TestTable {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;
}