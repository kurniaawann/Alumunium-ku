/*
  Warnings:

  - You are about to alter the column `height` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `width` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `incoming_items` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `items` MODIFY `height` DOUBLE NULL,
    MODIFY `width` DOUBLE NULL;
