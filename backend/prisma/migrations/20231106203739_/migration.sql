-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "finished_date" DROP NOT NULL,
ALTER COLUMN "finished_date" DROP DEFAULT;
