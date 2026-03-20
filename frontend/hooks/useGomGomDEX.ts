import { useMemo } from "react";
import { useWalletClient } from "wagmi";
import { ethers } from "ethers";
import abi from "@/lib/contracts/GomGomDEX.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts/contractAddresses";

export const useGomGomDEX = () => {
  const { data: walletClient } = useWalletClient();
  return useMemo(() => {
    if (!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient);
    return new ethers.Contract(CONTRACT_ADDRESSES.GomGomDEX, abi.abi, provider);
  }, [walletClient]);
};
