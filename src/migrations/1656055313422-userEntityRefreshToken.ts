import {MigrationInterface, QueryRunner} from "typeorm";

export class userEntityRefreshToken1656055313422 implements MigrationInterface {
    name = 'userEntityRefreshToken1656055313422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refresh_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refresh_token"`);
    }

}
