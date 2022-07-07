import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits11657162445772 implements MigrationInterface {
    name = 'moreEntityEdits11657162445772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "alarm" CASCADE`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "alarmId" TO "alarm"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_91f764fb5e43fd7c62f85f8e33c" TO "UQ_d98d15288ac6ee9bdd52c3f4a03"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_d98d15288ac6ee9bdd52c3f4a03"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "alarm"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "alarm" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "is_occupied"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "is_occupied" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "is_occupied"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "is_occupied" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "alarm"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "alarm" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_d98d15288ac6ee9bdd52c3f4a03" UNIQUE ("alarm")`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_d98d15288ac6ee9bdd52c3f4a03" TO "UQ_91f764fb5e43fd7c62f85f8e33c"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "alarm" TO "alarmId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_91f764fb5e43fd7c62f85f8e33c" FOREIGN KEY ("alarmId") REFERENCES "alarm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
