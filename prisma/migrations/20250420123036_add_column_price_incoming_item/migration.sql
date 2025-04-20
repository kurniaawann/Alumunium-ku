/*
  Warnings:

  - Added the required column `priceIncomingItem` to the `incoming_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `incoming_items` ADD COLUMN `priceIncomingItem` INTEGER NOT NULL;
