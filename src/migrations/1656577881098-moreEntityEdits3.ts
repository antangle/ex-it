import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits31656577881098 implements MigrationInterface {
    name = 'moreEntityEdits31656577881098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "refresh_token" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "refresh_token" SET NOT NULL`);
    }

}
