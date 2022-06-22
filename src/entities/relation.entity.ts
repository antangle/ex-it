
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { TestTable } from './test.entity';

@Entity({name: 'test_relation'})
export class TestRelation {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => TestTable, testTable => testTable.testRelation)
    testTable: TestTable;
}