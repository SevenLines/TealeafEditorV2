import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1685814631964 implements MigrationInterface {
    name = 'Auto1685814631964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons_lab" ADD "tip" character varying NULL`);
        await queryRunner.query(`ALTER TABLE "lessons_task" ADD "tip" character varying NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons_lab" DROP COLUMN "tip"`);
        await queryRunner.query(`ALTER TABLE "lessons_task" DROP COLUMN "tip"`);
    }

}
