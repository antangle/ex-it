import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits161657083521291 implements MigrationInterface {
    name = 'moreEntityEdits161657083521291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "is_occupied" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "is_occupied"`);
    }

}
