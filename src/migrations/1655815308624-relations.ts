import {MigrationInterface, QueryRunner} from "typeorm";

export class relations1655815308624 implements MigrationInterface {
    name = 'relations1655815308624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_tag" ADD "roomId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD "tagId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "roomId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ADD "createUserId" integer`);
        await queryRunner.query(`ALTER TABLE "review" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD CONSTRAINT "FK_6e00d2ad2639a924080d88fe36f" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD CONSTRAINT "FK_381b568189fd3396d624c1302e0" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_5f35fd0b9ca93e9eb59db375051" FOREIGN KEY ("createUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_5f35fd0b9ca93e9eb59db375051"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP CONSTRAINT "FK_381b568189fd3396d624c1302e0"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP CONSTRAINT "FK_6e00d2ad2639a924080d88fe36f"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "createUserId"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "roomId"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP COLUMN "tagId"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP COLUMN "roomId"`);
    }

}
