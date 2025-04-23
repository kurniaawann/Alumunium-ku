-- AlterTable
ALTER TABLE `stock_logs` MODIFY `change_type` ENUM('IN', 'OUT', 'USED', 'OUT_EDIT', 'OUT_DELETE', 'IN_EDIT', 'IN_DELETE') NOT NULL;
