import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1685728932185 implements MigrationInterface {
    name = 'Auto1685728932185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lessons_task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "complexity" integer NOT NULL, "content" character varying NOT NULL, "additional_content" character varying NOT NULL, "order" integer NOT NULL, "tags" text array NOT NULL, "visible" boolean NOT NULL, "group_id" integer NOT NULL, "lab_id" integer NOT NULL, "custom_class" character varying NOT NULL, "youtube_link" character varying NOT NULL, "subtasks" jsonb NOT NULL, "students_info" jsonb NOT NULL, "show_help_in_modal" boolean NOT NULL, CONSTRAINT "PK_c056c2ecac466f301485b99d91b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessons_taskgroup" ("id" SERIAL NOT NULL, "title" integer NOT NULL, "lab_id" integer NOT NULL, "type" integer NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_999f1160f983166f66e6939691b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessons_discipline" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "modified_at" TIMESTAMP NOT NULL DEFAULT now(), "jekyll_folder" character varying NOT NULL, "deploy_command" character varying NOT NULL, "site_url" character varying NOT NULL, "archive" boolean NOT NULL, "groups" jsonb NOT NULL, CONSTRAINT "PK_64d92715e8a466a0329766f388d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessons_lab" ("id" SERIAL NOT NULL, "alias" character varying NOT NULL, "title" character varying NOT NULL, "order" integer NOT NULL, "icon" character varying NOT NULL, "group_id" integer NOT NULL, "type" integer NOT NULL, "content" character varying NOT NULL, "content_additional" character varying NOT NULL, "remark" character varying NOT NULL, "modified_at" TIMESTAMP NOT NULL DEFAULT now(), "discipline_id" integer NOT NULL, "visible" boolean NOT NULL, "secret" boolean NOT NULL, CONSTRAINT "PK_9db47cba0729e54d53958579376" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessons_student" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "second_name" character varying NOT NULL, "patronymic" character varying NOT NULL, "sex" integer NOT NULL, "group_id" integer NOT NULL, "visible" boolean NOT NULL, CONSTRAINT "PK_3bc5bfec4b380597fc4e0042e1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lessons_task" ADD CONSTRAINT "FK_3907459681b09644dfc5dfa775f" FOREIGN KEY ("lab_id") REFERENCES "lessons_lab"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons_taskgroup" ADD CONSTRAINT "FK_79fa605507a30ae53783b50985f" FOREIGN KEY ("lab_id") REFERENCES "lessons_lab"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons_lab" ADD CONSTRAINT "FK_9ad8d925c79f44ef1362c25be60" FOREIGN KEY ("discipline_id") REFERENCES "lessons_discipline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons_lab" DROP CONSTRAINT "FK_9ad8d925c79f44ef1362c25be60"`);
        await queryRunner.query(`ALTER TABLE "lessons_taskgroup" DROP CONSTRAINT "FK_79fa605507a30ae53783b50985f"`);
        await queryRunner.query(`ALTER TABLE "lessons_task" DROP CONSTRAINT "FK_3907459681b09644dfc5dfa775f"`);
        await queryRunner.query(`DROP TABLE "lessons_student"`);
        await queryRunner.query(`DROP TABLE "lessons_lab"`);
        await queryRunner.query(`DROP TABLE "lessons_discipline"`);
        await queryRunner.query(`DROP TABLE "lessons_taskgroup"`);
        await queryRunner.query(`DROP TABLE "lessons_task"`);
    }

}
