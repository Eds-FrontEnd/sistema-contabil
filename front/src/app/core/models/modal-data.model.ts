import { Transaction } from "./transaction.model";

export interface ModalData {
  title: string;
  message?: string;
  transaction?: Transaction;
  isConfirm?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}
