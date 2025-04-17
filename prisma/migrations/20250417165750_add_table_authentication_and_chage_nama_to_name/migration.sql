/*
  Warnings:

  - You are about to drop the column `name_item` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `user` table. All the data in the column will be lost.
  - Added the required column `item_name` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` DROP COLUMN `name_item`,
    ADD COLUMN `item_name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `nama`,
    ADD COLUMN `user_name` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `authentications` (
    `access_token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `authentications_access_token_key`(`access_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
