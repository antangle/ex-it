import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits41657189996580 implements MigrationInterface {
    name = 'moreEntityEdits41657189996580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b"`);
    }

}
