import { Account } from "viem";
import { Chain } from "viem";

export interface AuthState {
  address: `0x${string}` | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  account: Account | null;
  chain: Chain | null;
}
