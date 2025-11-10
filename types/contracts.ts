import { TransactionReceipt } from "viem"; // Eğer viem kullanıyorsan

// Kontrat isimlerini belirten tip
export type ContractName = string;

// Okuma işlemleri için kontrat state'i (Örneğin: `balanceOf`)
export interface ContractState {
  data: any; // Burada dönecek veri tipi değişebilir, uygun bir tür ekleyebilirsin
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// Yazma işlemleri için genel state
export interface ContractWriteState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash: `0x${string}` | null;
  receipt: TransactionReceipt | null;
}

// Kontratları içeren ana state
export interface ContractsState {
  [key: ContractName]: {
    reads: {
      [functionName: string]: ContractState;
    };
    writes: {
      [functionName: string]: ContractWriteState;
    };
  };
}
