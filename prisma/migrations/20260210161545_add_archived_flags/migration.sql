-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
