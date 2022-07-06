import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits51656853338390 implements MigrationInterface {
    name = 'moreEntityEdits51656853338390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "alarm" ("id" SERIAL NOT NULL, "talk_alert" boolean NOT NULL, "feedback_alert" boolean NOT NULL, "notice_alert" boolean NOT NULL, "email_alert" boolean NOT NULL, CONSTRAINT "PK_ea806c911b4b0617f2e306094e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "talk_time"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "call_time"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "talk_time" integer`);
        await queryRunner.query(`ALTER TABLE "room" ADD "call_time" integer`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "alarmId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_91f764fb5e43fd7c62f85f8e33c" UNIQUE ("alarmId")`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "content" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "score" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_91f764fb5e43fd7c62f85f8e33c" FOREIGN KEY ("alarmId") REFERENCES "alarm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_91f764fb5e43fd7c62f85f8e33c"`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "score" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "content" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_91f764fb5e43fd7c62f85f8e33c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "alarmId"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "call_time"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "talk_time"`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "call_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "talk_time" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "alarm"`);
    }

}
