/*
  Warnings:

  - You are about to drop the `authentications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `authentications`;

-- CreateTable
CREATE TABLE `authentication` (
    `access_token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `authentication_access_token_key`(`access_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
