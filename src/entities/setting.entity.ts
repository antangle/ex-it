import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Setting {
    @PrimaryGeneratedColumn()
    id?: number;

}