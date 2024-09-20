-- DropForeignKey
ALTER TABLE `WishlistedProduct` DROP FOREIGN KEY `WishlistedProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `WishlistedProduct` DROP FOREIGN KEY `WishlistedProduct_userId_fkey`;

-- AddForeignKey
ALTER TABLE `WishlistedProduct` ADD CONSTRAINT `WishlistedProduct_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistedProduct` ADD CONSTRAINT `WishlistedProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
