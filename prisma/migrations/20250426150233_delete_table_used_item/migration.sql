/*
  Warnings:

  - You are about to drop the `used_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `used_items` DROP FOREIGN KEY `used_items_item_id_fkey`;

-- DropTable
DROP TABLE `used_items`;
