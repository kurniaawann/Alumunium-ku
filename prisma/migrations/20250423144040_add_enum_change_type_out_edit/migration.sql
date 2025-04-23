-- AlterTable
ALTER TABLE `stock_logs` MODIFY `change_type` ENUM('IN', 'OUT', 'USED', 'OUT_EDIT') NOT NULL;
