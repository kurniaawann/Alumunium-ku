/*
  Warnings:

  - You are about to drop the column `delete_at` on the `incoming_items` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `incoming_items` table. All the data in the column will be lost.
  - You are about to drop the column `delete_at` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `items` table. All the data in the column will be lost.
  - Made the column `updated_at` on table `incoming_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `incoming_items` DROP COLUMN `delete_at`,
    DROP COLUMN `is_delete`,
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `items` DROP COLUMN `delete_at`,
    DROP COLUMN `is_delete`;
