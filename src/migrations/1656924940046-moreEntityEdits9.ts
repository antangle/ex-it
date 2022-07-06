import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits91656924940046 implements MigrationInterface {
    name = 'moreEntityEdits91656924940046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_tag" DROP CONSTRAINT "FK_6e00d2ad2639a924080d88fe36f"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP CONSTRAINT "FK_381b568189fd3396d624c1302e0"`);
        await queryRunner.query(`ALTER TABLE "room_tag" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_tag" ALTER COLUMN "tagId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD CONSTRAINT "FK_6e00d2ad2639a924080d88fe36f" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD CONSTRAINT "FK_381b568189fd3396d624c1302e0" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_tag" DROP CONSTRAINT "FK_381b568189fd3396d624c1302e0"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP CONSTRAINT "FK_6e00d2ad2639a924080d88fe36f"`);
        await queryRunner.query(`ALTER TABLE "room_tag" ALTER COLUMN "tagId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_tag" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD CONSTRAINT "FK_381b568189fd3396d624c1302e0" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD CONSTRAINT "FK_6e00d2ad2639a924080d88fe36f" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
