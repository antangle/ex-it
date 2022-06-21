import {MigrationInterface, QueryRunner} from "typeorm";

export class nownow1655722197714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`ALTER TABLE test_table RENAME COLUMN name TO testname`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`ALTER TABLE test_table RENAME COLUMN testname TO name`);
    }
}
