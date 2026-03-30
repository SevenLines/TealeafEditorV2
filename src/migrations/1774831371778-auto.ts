import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1774831371778 implements MigrationInterface {
    name = 'Auto1774831371778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons_lab" ADD "image" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons_lab" DROP COLUMN "image"`);
    }

}
