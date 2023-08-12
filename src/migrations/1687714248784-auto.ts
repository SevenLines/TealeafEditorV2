import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1687714248784 implements MigrationInterface {
    name = 'Auto1687714248784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons_task" DROP CONSTRAINT "lessons_task_lab_id_8999f511_fk_lessons_lab_id"`);
        await queryRunner.query(`ALTER TABLE "lessons_task" DROP CONSTRAINT "lessons_task_group_id_5a190d2d_fk_lessons_taskgroup_id"`);
        await queryRunner.query(`ALTER TABLE "lessons_taskgroup" DROP CONSTRAINT "lessons_taskgroup_lab_id_98e821a3_fk_lessons_lab_id"`);
        await queryRunner.query(`ALTER TABLE "lessons_lab" DROP CONSTRAINT "lessons_lab_discipline_id_602673c9_fk_lessons_discipline_id"`);
        await queryRunner.query(`ALTER TABLE "lessons_lab" DROP CONSTRAINT "lessons_lab_group_id_045fdbf0_fk_lessons_group_id"`);
        await queryRunner.query(`DROP INDEX "public"."lessons_task_group_id_5a190d2d"`);
        await queryRunner.query(`DROP INDEX "public"."lessons_task_lab_id_8999f511"`);
        await queryRunner.query(`DROP INDEX "public"."lessons_taskgroup_lab_id_98e821a3"`);
        await queryRunner.query(`DROP INDEX "public"."lessons_lab_discipline_id_602673c9"`);
        await queryRunner.query(`DROP INDEX "public"."lessons_lab_group_id_045fdbf0"`);
        await queryRunner.query(`CREATE TABLE "students" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "second_name" character varying NOT NULL, "patronymic" character varying NOT NULL, "sex" integer NOT NULL, "group_title" integer NOT NULL, "visible" boolean NOT NULL, CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lessons_lab" ALTER COLUMN "modified_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lessons_discipline" ALTER COLUMN "modified_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lessons_task" ADD CONSTRAINT "FK_3907459681b09644dfc5dfa775f" FOREIGN KEY ("lab_id") REFERENCES "lessons_lab"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons_taskgroup" ADD CONSTRAINT "FK_79fa605507a30ae53783b50985f" FOREIGN KEY ("lab_id") REFERENCES "lessons_lab"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons_lab" ADD CONSTRAINT "FK_9ad8d925c79f44ef1362c25be60" FOREIGN KEY ("discipline_id") REFERENCES "lessons_discipline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons_lab" DROP CONSTRAINT "FK_9ad8d925c79f44ef1362c25be60"`);
        await queryRunner.query(`ALTER TABLE "lessons_taskgroup" DROP CONSTRAINT "FK_79fa605507a30ae53783b50985f"`);
        await queryRunner.query(`ALTER TABLE "lessons_task" DROP CONSTRAINT "FK_3907459681b09644dfc5dfa775f"`);
        await queryRunner.query(`ALTER TABLE "lessons_discipline" ALTER COLUMN "modified_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "lessons_lab" ALTER COLUMN "modified_at" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`CREATE INDEX "lessons_lab_group_id_045fdbf0" ON "lessons_lab" ("group_id") `);
        await queryRunner.query(`CREATE INDEX "lessons_lab_discipline_id_602673c9" ON "lessons_lab" ("discipline_id") `);
        await queryRunner.query(`CREATE INDEX "lessons_taskgroup_lab_id_98e821a3" ON "lessons_taskgroup" ("lab_id") `);
        await queryRunner.query(`CREATE INDEX "lessons_task_lab_id_8999f511" ON "lessons_task" ("lab_id") `);
        await queryRunner.query(`CREATE INDEX "lessons_task_group_id_5a190d2d" ON "lessons_task" ("group_id") `);
        await queryRunner.query(`ALTER TABLE "lessons_lab" ADD CONSTRAINT "lessons_lab_group_id_045fdbf0_fk_lessons_group_id" FOREIGN KEY ("group_id") REFERENCES "lessons_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "lessons_lab" ADD CONSTRAINT "lessons_lab_discipline_id_602673c9_fk_lessons_discipline_id" FOREIGN KEY ("discipline_id") REFERENCES "lessons_discipline"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "lessons_taskgroup" ADD CONSTRAINT "lessons_taskgroup_lab_id_98e821a3_fk_lessons_lab_id" FOREIGN KEY ("lab_id") REFERENCES "lessons_lab"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "lessons_task" ADD CONSTRAINT "lessons_task_group_id_5a190d2d_fk_lessons_taskgroup_id" FOREIGN KEY ("group_id") REFERENCES "lessons_taskgroup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "lessons_task" ADD CONSTRAINT "lessons_task_lab_id_8999f511_fk_lessons_lab_id" FOREIGN KEY ("lab_id") REFERENCES "lessons_lab"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
    }

}
