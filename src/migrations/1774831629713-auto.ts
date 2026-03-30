import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1774831629713 implements MigrationInterface {
    name = 'Auto1774831629713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons_task" ADD "image" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons_task" DROP COLUMN "image"`);
    }

}
