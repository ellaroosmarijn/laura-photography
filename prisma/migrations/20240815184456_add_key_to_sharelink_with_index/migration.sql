/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `ShareLink` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `ShareLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShareLink" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_key_key" ON "ShareLink"("key");

-- CreateIndex
CREATE INDEX "ShareLink_key_idx" ON "ShareLink"("key");
