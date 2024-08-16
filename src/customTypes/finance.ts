export enum PaymentChannel {
  PAYSTACK = 'paystack'
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export enum Currency {
  NGN = 'NGN',
  USD = 'USD'
}

export type AccountBalance = {
  balance: number;
  currency: Currency;
  lastDeposit: {
    reference: string;
    amount: number;
    currency: Currency;
    channel: PaymentChannel;
    status: PaymentStatus;
    paidAt: string;
  };
};

export type Bill = {
  id: string;
  type: string;
  description: string;
  amountUsd: number;
  amountNgn: number;
  dueDate: string | null;
  isPaid: boolean;
  paidAt: string | null;
  referenceNumber: string | null;
  createdAt: string;
};
