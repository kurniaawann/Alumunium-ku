/*
  Warnings:

  - The primary key for the `incoming_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `outgoing_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `stock_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `used_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[no_handphone]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `no_handphone` to the `user` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `incoming_items` DROP PRIMARY KEY,
    MODIFY `incoming_items_id` VARCHAR(191) NOT NULL,
    MODIFY `item_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`incoming_items_id`);

-- AlterTable
ALTER TABLE `items` DROP PRIMARY KEY,
    MODIFY `item_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`item_id`);

-- AlterTable
ALTER TABLE `outgoing_items` DROP PRIMARY KEY,
    MODIFY `incoming_items_id` VARCHAR(191) NOT NULL,
    MODIFY `item_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`incoming_items_id`);

-- AlterTable
ALTER TABLE `stock_logs` DROP PRIMARY KEY,
    MODIFY `logId` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`logId`);

-- AlterTable
ALTER TABLE `used_items` DROP PRIMARY KEY,
    MODIFY `used_item_id` VARCHAR(191) NOT NULL,
    MODIFY `item_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`used_item_id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    ADD COLUMN `is_verified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `no_handphone` VARCHAR(15) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- CreateTable
CREATE TABLE `otp` (
    `user_id` VARCHAR(191) NOT NULL,
    `otp_code` VARCHAR(6) NOT NULL,
    `created_at_otp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at_otp` DATETIME(3) NULL,

    UNIQUE INDEX `otp_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_no_handphone_key` ON `user`(`no_handphone`);

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);

-- AddForeignKey
ALTER TABLE `otp` ADD CONSTRAINT `otp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incoming_items` ADD CONSTRAINT `incoming_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outgoing_items` ADD CONSTRAINT `outgoing_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_logs` ADD CONSTRAINT `stock_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `used_items` ADD CONSTRAINT `used_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
