import { JsonRpcProvider, Contract } from "ethers";
import abi from "@/lib/contracts/GomGomTokenFactory.json" assert { type: "json" };

const RPC_URL = "https://rpc.sepolia-api.lisk.com";
const CONTRACT_ADDRESS = "0x8d415aCfDdbd2da2F4F292D9eb3Ad30b0F499d49";

(async () => {
  const provider = new JsonRpcProvider(RPC_URL);
  const contract = new Contract(CONTRACT_ADDRESS, abi, provider);
  const count = await contract.getBrandCount();
  console.log("Brand count:", count.toString());
})();