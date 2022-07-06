import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits71656858890451 implements MigrationInterface {
    name = 'moreEntityEdits71656858890451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ADD "mode" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "mode"`);
    }

}
