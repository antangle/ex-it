import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits31657189789766 implements MigrationInterface {
    name = 'moreEntityEdits31657189789766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_5f4effb7cd258ffa9ef554cfbbb"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "is_popular"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede"`);
        await queryRunner.query(`ALTER TABLE "room_join" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58"`);
        await queryRunner.query(`ALTER TABLE "room_join" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag" ADD "parentId" integer`);
        await queryRunner.query(`ALTER TABLE "tag" ADD "is_popular" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_5f4effb7cd258ffa9ef554cfbbb" FOREIGN KEY ("parentId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
