-- AlterTable
ALTER TABLE `Product` ADD COLUMN `bought` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `picture` LONGTEXT NOT NULL,
    MODIFY `description` LONGTEXT NOT NULL;
