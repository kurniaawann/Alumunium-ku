/*
  Warnings:

  - The primary key for the `project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `project` table. All the data in the column will be lost.
  - The primary key for the `projectitem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `projectitem` table. All the data in the column will be lost.
  - The primary key for the `projectitemonproject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `projectitemonproject` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_item_id` to the `ProjectItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_item_on_project_id` to the `ProjectItemOnProject` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `project` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `project_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`project_id`);

-- AlterTable
ALTER TABLE `projectitem` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `project_item_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`project_item_id`);

-- AlterTable
ALTER TABLE `projectitemonproject` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `project_item_on_project_id` VARCHAR(191) NOT NULL,
    MODIFY `project_id` VARCHAR(191) NOT NULL,
    MODIFY `project_item_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`project_item_on_project_id`);

-- AddForeignKey
ALTER TABLE `ProjectItemOnProject` ADD CONSTRAINT `ProjectItemOnProject_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectItemOnProject` ADD CONSTRAINT `ProjectItemOnProject_project_item_id_fkey` FOREIGN KEY (`project_item_id`) REFERENCES `ProjectItem`(`project_item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
