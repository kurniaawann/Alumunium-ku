/*
  Warnings:

  - Added the required column `updated_at` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `incoming_items` DROP FOREIGN KEY `incoming_items_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `outgoing_items` DROP FOREIGN KEY `outgoing_items_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_logs` DROP FOREIGN KEY `stock_logs_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `used_items` DROP FOREIGN KEY `used_items_item_id_fkey`;

-- DropIndex
DROP INDEX `incoming_items_item_id_fkey` ON `incoming_items`;

-- DropIndex
DROP INDEX `outgoing_items_item_id_fkey` ON `outgoing_items`;

-- DropIndex
DROP INDEX `stock_logs_user_id_fkey` ON `stock_logs`;

-- DropIndex
DROP INDEX `used_items_item_id_fkey` ON `used_items`;

-- AlterTable
ALTER TABLE `items` ADD COLUMN `created_by` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `updated_by` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `incoming_items` ADD CONSTRAINT `incoming_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outgoing_items` ADD CONSTRAINT `outgoing_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_logs` ADD CONSTRAINT `stock_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `used_items` ADD CONSTRAINT `used_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;
