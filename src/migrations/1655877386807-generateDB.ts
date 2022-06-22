import {MigrationInterface, QueryRunner} from "typeorm";

export class generateDB1655877386807 implements MigrationInterface {
    name = 'generateDB1655877386807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reply" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inquiry" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "type" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_3e226d0994e8bd24252dd65e1b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "setting" ("id" SERIAL NOT NULL, CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "nickname" character varying NOT NULL, "phone" character varying NOT NULL, "terms" boolean NOT NULL, "personal_info_terms" boolean NOT NULL, "is_identified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "settingId" integer, "authId" integer, CONSTRAINT "REL_a2122bd128c9af8378a378ed6b" UNIQUE ("settingId"), CONSTRAINT "REL_ad5065ee18a722baaa932d1c3c" UNIQUE ("authId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "test_table" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "testRelationId" integer, CONSTRAINT "REL_2892152abe27d1e69251efd593" UNIQUE ("testRelationId"), CONSTRAINT "PK_a706f019496a4c4023f327c6880" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "test_relation" ("id" SERIAL NOT NULL, CONSTRAINT "PK_6eba2b378b3e40af6910e5d5aea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "score" integer NOT NULL, "userId" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "is_popular" boolean NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_tag" ("id" SERIAL NOT NULL, "roomId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_2e639ede71ebcb11bfa302e05db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_join" ("id" SERIAL NOT NULL, "roomId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_fdc25e11a0aab278d8ba49026de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "max_occupancy" integer NOT NULL, "current_occupancy" integer NOT NULL, "state" character varying NOT NULL, "communication" character varying NOT NULL, "hardcore" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "observer" boolean NOT NULL, "createUserId" integer, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inquiry" ADD CONSTRAINT "FK_7806c6fea3e0ff475bb422ba0c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a2122bd128c9af8378a378ed6b8" FOREIGN KEY ("settingId") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_table" ADD CONSTRAINT "FK_2892152abe27d1e69251efd593e" FOREIGN KEY ("testRelationId") REFERENCES "test_relation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD CONSTRAINT "FK_6e00d2ad2639a924080d88fe36f" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_tag" ADD CONSTRAINT "FK_381b568189fd3396d624c1302e0" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_join" ADD CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_5f35fd0b9ca93e9eb59db375051" FOREIGN KEY ("createUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_5f35fd0b9ca93e9eb59db375051"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2e443c8f03b92483ef70e6c4ede"`);
        await queryRunner.query(`ALTER TABLE "room_join" DROP CONSTRAINT "FK_2ee05cce97f78386ce6512f8f58"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP CONSTRAINT "FK_381b568189fd3396d624c1302e0"`);
        await queryRunner.query(`ALTER TABLE "room_tag" DROP CONSTRAINT "FK_6e00d2ad2639a924080d88fe36f"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`ALTER TABLE "test_table" DROP CONSTRAINT "FK_2892152abe27d1e69251efd593e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a2122bd128c9af8378a378ed6b8"`);
        await queryRunner.query(`ALTER TABLE "inquiry" DROP CONSTRAINT "FK_7806c6fea3e0ff475bb422ba0c0"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "room_join"`);
        await queryRunner.query(`DROP TABLE "room_tag"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "test_relation"`);
        await queryRunner.query(`DROP TABLE "test_table"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "setting"`);
        await queryRunner.query(`DROP TABLE "inquiry"`);
        await queryRunner.query(`DROP TABLE "reply"`);
    }

}
