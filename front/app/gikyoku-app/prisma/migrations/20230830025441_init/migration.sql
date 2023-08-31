-- CreateTable
CREATE TABLE `Author` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `group` VARCHAR(191) NULL,
    `profile` VARCHAR(191) NULL,
    `masterpiece` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `author_id` INTEGER NOT NULL,
    `man` INTEGER NOT NULL,
    `woman` INTEGER NOT NULL,
    `others` INTEGER NOT NULL,
    `totalNumber` INTEGER NOT NULL,
    `playtime` INTEGER NOT NULL,
    `synopsis` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `website1` VARCHAR(191) NULL,
    `website2` VARCHAR(191) NULL,
    `website3` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Author`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
