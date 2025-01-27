-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "processing_status" INTEGER NOT NULL DEFAULT 0;
