import {MigrationInterface, QueryRunner} from "typeorm";

export class moreEntityEdits81656859452746 implements MigrationInterface {
    name = 'moreEntityEdits81656859452746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ADD "roomId" integer`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "UQ_6a8b1e9139142b2c3fa787a33a7" UNIQUE ("roomId")`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_6a8b1e9139142b2c3fa787a33a7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_6a8b1e9139142b2c3fa787a33a7"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "UQ_6a8b1e9139142b2c3fa787a33a7"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "roomId"`);
    }

}
