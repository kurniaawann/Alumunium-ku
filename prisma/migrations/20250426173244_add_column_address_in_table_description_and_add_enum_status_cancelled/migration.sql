/*
  Warnings:

  - Added the required column `address` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `projectitemonproject` DROP FOREIGN KEY `ProjectItemOnProject_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `projectitemonproject` DROP FOREIGN KEY `ProjectItemOnProject_project_item_id_fkey`;

-- DropIndex
DROP INDEX `ProjectItemOnProject_project_id_fkey` ON `projectitemonproject`;

-- DropIndex
DROP INDEX `ProjectItemOnProject_project_item_id_fkey` ON `projectitemonproject`;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE `ProjectItemOnProject` ADD CONSTRAINT `ProjectItemOnProject_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectItemOnProject` ADD CONSTRAINT `ProjectItemOnProject_project_item_id_fkey` FOREIGN KEY (`project_item_id`) REFERENCES `ProjectItem`(`project_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;
