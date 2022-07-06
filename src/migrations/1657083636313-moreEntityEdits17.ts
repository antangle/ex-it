import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits171657083636313 implements MigrationInterface {
    name = 'moreEntityEdits171657083636313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "is_online" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "is_occupied" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "is_occupied" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "is_online" DROP DEFAULT`);
    }

}
