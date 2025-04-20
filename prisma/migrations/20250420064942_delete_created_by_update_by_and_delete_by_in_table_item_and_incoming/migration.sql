/*
  Warnings:

  - You are about to drop the column `delete_by` on the `incoming_items` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `incoming_items` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `delete_by` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `incoming_items` DROP COLUMN `delete_by`,
    DROP COLUMN `updated_by`,
    MODIFY `received_by` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `items` DROP COLUMN `created_by`,
    DROP COLUMN `delete_by`,
    DROP COLUMN `updated_by`;
