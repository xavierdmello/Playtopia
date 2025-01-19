import { RpcProvider, Account, Contract, CallData, constants } from "starknet";

const GOLF_ADDRESS =
  "0x043231ffd97102945b995fa50a859bb6c9e612e064ed3a6ee18116d66239c659";
// const RPC_URL = "http://100.64.47.126:5050";
const RPC_URL = "http://localhost:5050";
// ... existing code for createAccount ...

async function checkPlayerState(playerAddress) {
  const provider = new RpcProvider({
    nodeUrl: RPC_URL,
    chainId: constants.StarknetChainId.SN_GOERLI,
  });

  try {
    const response = await provider.callContract({
      contractAddress: GOLF_ADDRESS,
      entrypoint: "get_player_info",
      calldata: [playerAddress],
    });

    // Skip first value (array length) and parse the rest
    const maxShots = Number(BigInt(response[1]));
    const remainingShots = Number(BigInt(response[2]));
    const playerScore = Number(BigInt(response[3]));
    const hasShot = Boolean(Number(BigInt(response[4])));
    const lastHeading = Number(BigInt(response[5]));

    return {
      maxShots,
      remainingShots,
      playerScore,
      hasShot,
      lastHeading,
    };
  } catch (error) {
    console.error("Error checking player state:", error);
    throw error;
  }
}

async function monitorAndScore(ownerAccount, playerAddress) {
  let lastShotProcessed = false;

  while (true) {
    try {
      const state = await checkPlayerState(playerAddress);

      if (state.hasShot && !lastShotProcessed) {
        console.log(`Shot detected! Heading: ${state.lastHeading}`);
        // In starknetgood.js, modify the fetch call:
        const transformedHeading = state.lastHeading - 30; // Convert from 0-80 range to -40 to +40 range

        // Call the controller API to execute the shot
        try {
          const response = await fetch("http://localhost:5001/shoot", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              heading: transformedHeading,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          console.log("Shot executed successfully");
          console.log("Waiting 2 seconds before scoring...");

          // Wait 2 seconds to simulate game physics
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const points = 10;
          console.log(`Scoring ${points} points!`);
          await scoreGolfGame(
            ownerAccount.privateKey,
            ownerAccount.address,
            playerAddress,
            points
          );
        } catch (error) {
          console.error("Error executing shot:", error);
        }

        lastShotProcessed = true;
      } else if (!state.hasShot) {
        lastShotProcessed = false;
      }

      // Wait 1 second before next check
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error in monitoring loop:", error);
      // Wait 5 seconds before retrying after an error
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

// Example usage with the existing account data
const ownerAccount = {
  address: "0x034ba56f92265f0868c57d3fe72ecab144fc96f97954bbbc4252cef8e8a979ba",
  privateKey:
    "0x00000000000000000000000000000000b137668388dbe9acdfa3bc734cc2c469",
};

const playerAddress =
  "0x034BA56F92265f0868c57d3Fe72ECAB144Fc96F97954BbBc4252CeF8E8A979Ba";

console.log("Starting monitoring service...");
monitorAndScore(ownerAccount, playerAddress).catch(console.error);

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

// Helper function to create an account instance
const createAccount = (privateKey, address) => {
  const provider = new RpcProvider({
    nodeUrl: RPC_URL,
    chainId: constants.StarknetChainId.SN_GOERLI,
  });

  return new Account(provider, address, privateKey);
};
