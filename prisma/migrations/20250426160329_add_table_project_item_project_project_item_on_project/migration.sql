-- CreateTable
CREATE TABLE `ProjectItem` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL,
    `project_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `total_cost` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectItemOnProject` (
    `id` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,
    `project_item_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price_at_that_time` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectItemOnProject` ADD CONSTRAINT `ProjectItemOnProject_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectItemOnProject` ADD CONSTRAINT `ProjectItemOnProject_project_item_id_fkey` FOREIGN KEY (`project_item_id`) REFERENCES `ProjectItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
