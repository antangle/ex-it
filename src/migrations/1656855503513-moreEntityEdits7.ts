import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits71656855503513 implements MigrationInterface {
    name = 'moreEntityEdits71656855503513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "content"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ADD "content" character varying`);
    }

}
