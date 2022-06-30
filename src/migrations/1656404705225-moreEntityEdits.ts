import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits1656404705225 implements MigrationInterface {
    name = 'moreEntityEdits1656404705225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`CREATE TABLE "subtag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tagId" integer, CONSTRAINT "PK_70076414dee2cd58118ebdbdac5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authId"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "talk_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "call_time" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_authenticated" boolean`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "observer"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "observer" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede"`);
        await queryRunner.query(`ALTER TABLE "room_join" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_215625b2f6ca64a2c496104f22" ON "auth" ("email", "type") `);
        await queryRunner.query(`ALTER TABLE "subtag" ADD CONSTRAINT "FK_f64baf9a018be42d70769a508e4" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58"`);
        await queryRunner.query(`ALTER TABLE "subtag" DROP CONSTRAINT "FK_f64baf9a018be42d70769a508e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_215625b2f6ca64a2c496104f22"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "room_join" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "observer"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "observer" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_authenticated"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "call_time"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "talk_time"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "authId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6" UNIQUE ("authId")`);
        await queryRunner.query(`DROP TABLE "subtag"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
