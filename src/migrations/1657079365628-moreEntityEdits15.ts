import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits151657079365628 implements MigrationInterface {
    name = 'moreEntityEdits151657079365628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "is_online" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "is_online"`);
    }

}
