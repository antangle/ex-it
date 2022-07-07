import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits21657162905871 implements MigrationInterface {
    name = 'moreEntityEdits21657162905871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "roomname" character varying DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "roomname"`);
    }

}
