/*
  Warnings:

  - You are about to alter the column `status` on the `item` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `status` on the `shoppinglist` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - Added the required column `roomId` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item` MODIFY `status` ENUM('SUFFICIENT', 'NEAR_OUT', 'OUT_OF_STOCK') NOT NULL DEFAULT 'SUFFICIENT';

-- AlterTable
ALTER TABLE `shoppinglist` ADD COLUMN `roomId` INTEGER NOT NULL,
    MODIFY `status` ENUM('SUFFICIENT', 'NEAR_OUT', 'OUT_OF_STOCK') NOT NULL DEFAULT 'SUFFICIENT';

-- AddForeignKey
ALTER TABLE `ShoppingList` ADD CONSTRAINT `ShoppingList_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
