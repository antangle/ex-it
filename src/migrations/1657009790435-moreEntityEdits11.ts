import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits111657009790435 implements MigrationInterface {
    name = 'moreEntityEdits111657009790435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "current_occupancy"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "communication"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "nickname" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "state" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ADD "communication" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ADD "current_occupancy" integer NOT NULL`);
    }

}
