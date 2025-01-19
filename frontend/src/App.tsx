import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import PlayPage from "./components/PlayPage";
import { useTheme } from "./components/theme-provider";
import { useAccount } from "@starknet-react/core";
import { Provider, Contract, RpcProvider, CallData } from "starknet";
import { MANAGER_ABI, MANAGER_ADDRESS, RPC_URL } from "../../config";
import CreatePage from "./components/CreatePage";
import { Toaster } from "sonner";
import MiniGolf from "./components/games/MiniGolf";

// Helper function to decode felt252 strings
const decodeFelt252ToString = (felt252Str: string): string => {
  // Remove '0x' prefix
  const hex = felt252Str.substring(2);

  // Convert hex to bytes then to string
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};

function App() {
  const { setTheme } = useTheme();
  const { address, status } = useAccount();
  const [currentPage, setCurrentPage] = useState<string>("play");
  const [games, setGames] = useState<any[]>([]);

  const provider = useMemo(() => new RpcProvider({ nodeUrl: RPC_URL }), []);

  // Updated parseGames function with string decoding
  const parseGames = (data: any) => {
    if (!data || !Array.isArray(data)) return [];

    const games = [];
    // Skip first element (array length) and process in groups of 6
    const gameData = data.slice(1);

    // Return empty array if no games
    if (gameData.length === 0) return [];

    for (let i = 0; i < gameData.length; i += 6) {
      if (i + 5 >= gameData.length) break; // Ensure we have complete game data

      games.push({
        gameId: Number(BigInt(gameData[i])),
        gameName: decodeFelt252ToString(gameData[i + 1]),
        contractAddress: gameData[i + 2],
        thumbnailUrl: decodeFelt252ToString(gameData[i + 3]),
        likes: Number(BigInt(gameData[i + 4])),
        currentPlayers: Number(BigInt(gameData[i + 5])),
      });
    }

    return games;
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await provider.callContract({
          contractAddress: MANAGER_ADDRESS,
          entrypoint: "get_games",
          calldata: CallData.compile([]),
        });

        const parsedGames = parseGames(response);

        setGames(parsedGames);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    fetchGames();
    const intervalId = setInterval(fetchGames, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [provider]);

  setTheme("dark");

  return (
    <div className="container m-auto max-w-5xl mt-[10px] border border-border">
      <Header
        currentPage={currentPage as "play" | "stake" | "create" | "minigolf"}
        setCurrentPage={setCurrentPage}
      />

      <div className="p-4">
        {status === "connected" ? (
          <>
            {currentPage.toLowerCase() === "play" && (
              <PlayPage games={games} setCurrentPage={setCurrentPage} />
            )}
            {currentPage.toLowerCase() === "stake" && <div>Stake Page</div>}
            {currentPage.toLowerCase() === "create" && <CreatePage />}
            {currentPage.toLowerCase() === "minigolf" && <MiniGolf />}
            {!["play", "stake", "create", "minigolf"].includes(
              currentPage.toLowerCase()
            ) && <div>Game: {currentPage}</div>}
          </>
        ) : (
          <div className="m-12 justify-center align-middle flex">
            Please connect your wallet.
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;
