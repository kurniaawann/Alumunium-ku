/*
  Warnings:

  - The primary key for the `outgoing_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `incoming_items_id` on the `outgoing_items` table. All the data in the column will be lost.
  - Added the required column `outgoing_items_id` to the `outgoing_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `outgoing_items` DROP PRIMARY KEY,
    DROP COLUMN `incoming_items_id`,
    ADD COLUMN `outgoing_items_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`outgoing_items_id`);
