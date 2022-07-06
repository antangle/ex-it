import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits121657016630592 implements MigrationInterface {
    name = 'moreEntityEdits121657016630592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD "link" integer`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "nickname" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "nickname" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "link"`);
    }

}
