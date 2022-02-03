-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `password` VARCHAR(40) NOT NULL,
    `college` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role` (
    `role_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`role_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` ENUM('ADMIN', 'DIRECTOR', 'VICE_DIRECTOR', 'TEACHER', 'SECRETARY') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `courses_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_course` (
    `teacher_id` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`teacher_id`, `course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `papers` (
    `id` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `status` ENUM('WAITING', 'PASS', 'REJECT') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `papers_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paper_lifes` (
    `id` VARCHAR(191) NOT NULL,
    `paper_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` ENUM('WAITING', 'PASS', 'REJECT') NOT NULL,
    `content` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manager_notices` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(40) NOT NULL,
    `content` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_notices` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `manager_notice_id` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_userId_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_course` ADD CONSTRAINT `teacher_course_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paper_lifes` ADD CONSTRAINT `paper_lifes_paper_id_fkey` FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notices` ADD CONSTRAINT `user_notices_manager_notice_id_fkey` FOREIGN KEY (`manager_notice_id`) REFERENCES `manager_notices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
