import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits131657016823776 implements MigrationInterface {
    name = 'moreEntityEdits131657016823776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "UQ_92f3efd6f4950b88b90297991bf" UNIQUE ("name", "link")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "UQ_92f3efd6f4950b88b90297991bf"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name")`);
    }

}
