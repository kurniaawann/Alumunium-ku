/*
  Warnings:

  - You are about to drop the `projectitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projectitemonproject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `projectitemonproject` DROP FOREIGN KEY `ProjectItemOnProject_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `projectitemonproject` DROP FOREIGN KEY `ProjectItemOnProject_project_item_id_fkey`;

-- AlterTable
ALTER TABLE `project` MODIFY `start_date` DATETIME(3) NULL;

-- DropTable
DROP TABLE `projectitem`;

-- DropTable
DROP TABLE `projectitemonproject`;

-- CreateTable
CREATE TABLE `project_item` (
    `project_item_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`project_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_item_on_project` (
    `project_item_on_project_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `project_item_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price_at_that_time` INTEGER NOT NULL,

    PRIMARY KEY (`project_item_on_project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `project_item_on_project` ADD CONSTRAINT `project_item_on_project_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_item_on_project` ADD CONSTRAINT `project_item_on_project_project_item_id_fkey` FOREIGN KEY (`project_item_id`) REFERENCES `project_item`(`project_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;
