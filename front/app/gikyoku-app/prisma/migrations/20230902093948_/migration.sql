-- AlterTable
ALTER TABLE `Post` ADD COLUMN `amazon_img_text_url` TEXT NULL,
    ADD COLUMN `link_to_plot` VARCHAR(191) NULL,
    MODIFY `amazon_img_url` TEXT NULL;
