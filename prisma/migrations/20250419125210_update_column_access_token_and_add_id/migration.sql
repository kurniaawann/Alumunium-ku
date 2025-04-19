/*
  Warnings:

  - The required column `id` was added to the `authentication` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `authentication_access_token_key` ON `authentication`;

-- AlterTable
ALTER TABLE `authentication` ADD COLUMN `id` VARCHAR(191) NOT NULL,
    MODIFY `access_token` TEXT NOT NULL,
    ADD PRIMARY KEY (`id`);
