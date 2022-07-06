import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits41656751475415 implements MigrationInterface {
    name = 'moreEntityEdits41656751475415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
    }

}
