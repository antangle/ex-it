import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits141657078639166 implements MigrationInterface {
    name = 'moreEntityEdits141657078639166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "constrait"`);
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "link" TO "parentId"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_5f4effb7cd258ffa9ef554cfbbb" FOREIGN KEY ("parentId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_5f4effb7cd258ffa9ef554cfbbb"`);
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "parentId" TO "link"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "constrait" UNIQUE ("name", "link")`);
    }

}
