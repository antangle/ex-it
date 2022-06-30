import {MigrationInterface, QueryRunner} from "typeorm";

export class userEntityEdit1655991554197 implements MigrationInterface {
    name = 'userEntityEdit1655991554197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test_relation" ("id" SERIAL NOT NULL, CONSTRAINT "PK_6eba2b378b3e40af6910e5d5aea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "temp_uuid"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_url"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birth"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sex"`);
        await queryRunner.query(`ALTER TABLE "inquiry" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "settingId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_a2122bd128c9af8378a378ed6b8" UNIQUE ("settingId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "authId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6" UNIQUE ("authId")`);
        await queryRunner.query(`ALTER TABLE "test_table" ADD "age" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "test_table" ADD "testRelationId" integer`);
        await queryRunner.query(`ALTER TABLE "test_table" ADD CONSTRAINT "UQ_2892152abe27d1e69251efd593e" UNIQUE ("testRelationId")`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD "roomId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD "tagId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "roomId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ADD "createUserId" integer`);
        await queryRunner.query(`ALTER TABLE "review" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "inquiry" ADD CONSTRAINT "FK_7806c6fea3e0ff475bb422ba0c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a2122bd128c9af8378a378ed6b8" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_table" ADD CONSTRAINT "FK_2892152abe27d1e69251efd593e" FOREIGN KEY ("testRelationId") REFERENCES "test_relation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "test_table" DROP CONSTRAINT "FK_2892152abe27d1e69251efd593e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a2122bd128c9af8378a378ed6b8"`);
        await queryRunner.query(`ALTER TABLE "inquiry" DROP CONSTRAINT "FK_7806c6fea3e0ff475bb422ba0c0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "createUserId"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP COLUMN "roomId"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP COLUMN "tagId"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP COLUMN "roomId"`);
        await queryRunner.query(`ALTER TABLE "test_table" DROP CONSTRAINT "UQ_2892152abe27d1e69251efd593e"`);
        await queryRunner.query(`ALTER TABLE "test_table" DROP COLUMN "testRelationId"`);
        await queryRunner.query(`ALTER TABLE "test_table" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_a2122bd128c9af8378a378ed6b8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "settingId"`);
        await queryRunner.query(`ALTER TABLE "inquiry" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "sex" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "birth" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profile_url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "token" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "temp_uuid" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "test_relation"`);
    }

}
