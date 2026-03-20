import { useMemo } from "react";
import { useWalletClient } from "wagmi";
import { ethers } from "ethers";
import tokenAbi from "@/lib/contracts/GomGomTokenFactory.json";
import { CONTRACT_ADDRESSES } from "@/lib/contracts/contractAddresses";

export const useGomGomTokenFactory = () => {
  const { data: walletClient } = useWalletClient();
  const contract = useMemo(() => {
    if (!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient);
    return new ethers.Contract(CONTRACT_ADDRESSES.GomGomTokenFactory, tokenAbi.abi, provider);
  }, [walletClient]);
  return contract;
};

