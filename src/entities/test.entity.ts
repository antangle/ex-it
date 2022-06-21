import { TestRelation } from './relation.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class TestTable {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    age?: number;

    @OneToOne(() => TestRelation, testRelation => testRelation.testTable)
    @JoinColumn()
    testRelation: TestRelation;
}