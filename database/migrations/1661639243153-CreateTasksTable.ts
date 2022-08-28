import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1661639243153 implements MigrationInterface {
  name = 'CreateTasksTable1661639243153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('To do', 'In Progress', 'Done', 'Archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "status" "public"."tasks_status_enum" NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
  }
}
