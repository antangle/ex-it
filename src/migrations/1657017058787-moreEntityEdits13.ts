import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits131657017058787 implements MigrationInterface {
    name = 'moreEntityEdits131657017058787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "UQ_92f3efd6f4950b88b90297991bf"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "constrait" UNIQUE ("name", "link")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "constrait"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "UQ_92f3efd6f4950b88b90297991bf" UNIQUE ("name", "link")`);
    }

}
