import {MigrationInterface, QueryRunner} from "typeorm";

export class testRelationGen1655798548298 implements MigrationInterface {
    name = 'testRelationGen1655798548298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_relation" DROP CONSTRAINT "FK_2c058275f27682813a200bfd987"`);
        await queryRunner.query(`ALTER TABLE "test_relation" DROP CONSTRAINT "REL_2c058275f27682813a200bfd98"`);
        await queryRunner.query(`ALTER TABLE "test_relation" DROP COLUMN "testTableId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_relation" ADD "testTableId" integer`);
        await queryRunner.query(`ALTER TABLE "test_relation" ADD CONSTRAINT "REL_2c058275f27682813a200bfd98" UNIQUE ("testTableId")`);
        await queryRunner.query(`ALTER TABLE "test_relation" ADD CONSTRAINT "FK_2c058275f27682813a200bfd987" FOREIGN KEY ("testTableId") REFERENCES "test_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
