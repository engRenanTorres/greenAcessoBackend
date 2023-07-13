-- CreateTable
CREATE TABLE `boleto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_sacado` VARCHAR(255) NULL,
    `id_lote` INTEGER NOT NULL,
    `valor` DECIMAL(10, 0) NULL,
    `linha_digitavel` VARCHAR(255) NULL,
    `ativo` BOOLEAN NULL DEFAULT false,
    `criado_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `boletos_lotes_fk`(`id_lote`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NULL,
    `ativo` BOOLEAN NULL DEFAULT false,
    `criado_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `boleto` ADD CONSTRAINT `boletos_lotes_fk` FOREIGN KEY (`id_lote`) REFERENCES `lote`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
