/*
  Warnings:

  - Added the required column `updated_at` to the `incoming_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_by` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `incoming_items` ADD COLUMN `delete_at` DATETIME(3) NULL,
    ADD COLUMN `delete_by` VARCHAR(191) NULL,
    ADD COLUMN `is_delete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `updated_by` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `items` ADD COLUMN `delete_at` DATETIME(3) NULL,
    ADD COLUMN `delete_by` VARCHAR(191) NULL,
    ADD COLUMN `is_delete` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `created_by` VARCHAR(191) NOT NULL;
