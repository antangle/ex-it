import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits51657192219586 implements MigrationInterface {
    name = 'moreEntityEdits51657192219586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD "is_popular" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "roomname" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "UQ_7c646480b092a20dc25d518a592" UNIQUE ("roomname")`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "roomname" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "roomname" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "UQ_7c646480b092a20dc25d518a592"`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "roomname" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "is_popular"`);
    }

}
