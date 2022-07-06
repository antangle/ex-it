import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits31656579366085 implements MigrationInterface {
    name = 'moreEntityEdits31656579366085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" RENAME COLUMN "refresh_token" TO "oauth_refresh_token"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" RENAME COLUMN "oauth_refresh_token" TO "refresh_token"`);
    }

}
