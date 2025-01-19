import { RpcProvider, Account, Contract, CallData, constants } from "starknet";

const GOLF_ADDRESS =
  "0x05e453ddbe167ef94751321673959754b1242a52d11336593fe418239b0394aa";
const RPC_URL = "http://100.64.47.126:5050"; // Adjust based on your RPC endpoint

// Helper function to create an account instance
const createAccount = (privateKey, address) => {
  const provider = new RpcProvider({
    nodeUrl: RPC_URL,
    chainId: constants.StarknetChainId.SN_GOERLI,
  });

  return new Account(provider, address, privateKey);
};

// Function to call score on the Golf contract
export async function scoreGolfGame(
  ownerPrivateKey,
  ownerAddress,
  playerAddress,
  points
) {
  try {
    // Create account instance for the owner
    const account = createAccount(ownerPrivateKey, ownerAddress);

    // Create contract instance
    const contract = new Contract(
      [
        {
          name: "score",
          type: "function",
          inputs: [
            { name: "player", type: "ContractAddress" },
            { name: "points", type: "u32" },
          ],
          outputs: [],
          stateMutability: "external",
        },
      ],
      GOLF_ADDRESS,
      account,
      { cairoVersion: "2" }
    );

    // Call score function
    const result = await contract.score(
      CallData.compile([playerAddress, points])
    );

    console.log("Score transaction submitted:", result);
    return result;
  } catch (error) {
    console.error("Failed to score golf game:", error);
    throw error;
  }
}

const ownerAccount = {
  address: "0x034ba56f92265f0868c57d3fe72ecab144fc96f97954bbbc4252cef8e8a979ba",
  privateKey:
    "0x00000000000000000000000000000000b137668388dbe9acdfa3bc734cc2c469",
};

const playerAddress =
  "0x034ba56f92265f0868c57d3fe72ecab144fc96f97954bbbc4252cef8e8a979ba";

await scoreGolfGame(
  ownerAccount.privateKey,
  ownerAccount.address,
  playerAddress,
  10
);
