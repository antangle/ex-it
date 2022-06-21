import {MigrationInterface, QueryRunner} from "typeorm";

export class testgen1655789477821 implements MigrationInterface {
    name = 'testgen1655789477821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_table" ADD "age" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_table" DROP COLUMN "age"`);
    }

}
