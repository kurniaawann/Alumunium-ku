/*
  Warnings:

  - The primary key for the `stock_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `logId` on the `stock_logs` table. All the data in the column will be lost.
  - Added the required column `item_id` to the `stock_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `log_id` to the `stock_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_logs` DROP PRIMARY KEY,
    DROP COLUMN `logId`,
    ADD COLUMN `after_stock` INTEGER NULL,
    ADD COLUMN `before_stock` INTEGER NULL,
    ADD COLUMN `item_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `log_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`log_id`);

-- AddForeignKey
ALTER TABLE `stock_logs` ADD CONSTRAINT `stock_logs_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;
