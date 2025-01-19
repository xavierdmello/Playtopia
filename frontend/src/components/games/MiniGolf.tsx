import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { GOLF_ABI, GOLF_ADDRESS, RPC_URL } from "../../../../config";
import { Contract, Provider, RpcProvider } from "starknet";
import { toast } from "sonner";

export default function MiniGolf() {
  const [heading, setHeading] = useState(40); // Start at center (0 degrees)
  const [shotsRemaining, setShotsRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const { address } = useAccount();
  const [maxShots, setMaxShots] = useState(3);

  const provider = new RpcProvider({
    nodeUrl: RPC_URL,
  });

  const { contract } = useContract({
    abi: GOLF_ABI,
    address: GOLF_ADDRESS,
  });

  // Contract writes
  const { sendAsync: startGameAsync } = useSendTransaction({
    calls: contract && [contract.populate("start_game", [])],
  });

  const { sendAsync: shootAsync } = useSendTransaction({
    calls: contract &&
      heading !== undefined && [contract.populate("shoot", [heading])],
  });

  const fetchGameState = async () => {
    if (!address) return;

    try {
      const contract = new Contract(GOLF_ABI, GOLF_ADDRESS, provider);

      // Format the address to ensure it's a proper hex string with 0x prefix
      const formattedAddress = address.toLowerCase();

      console.log("Address being used:", formattedAddress);

      const info = await contract.get_player_info(formattedAddress);
      console.log("info:", info);

      // Parse the returned array - convert from felt252 to numbers
      const [maxShotsValue, remainingShots, score] = info.map((value: any) =>
        Number(BigInt(value))
      );

      setMaxShots(maxShotsValue);
      setShotsRemaining(remainingShots);
      setScore(score);
    } catch (error) {
      console.error("Error fetching game state:", error);
    }
  };

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 2000);
    return () => clearInterval(interval);
  }, [address]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (shotsRemaining <= 0) return;

      if (e.key === "ArrowLeft" || e.key === "a") {
        setHeading((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setHeading((prev) => Math.min(80, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [shotsRemaining]);

  const handleStartGame = async () => {
    try {
      await toast.promise(startGameAsync(), {
        loading: "Starting game...",
        success: "Game started!",
        error: "Failed to start game",
      });
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const handleShoot = async () => {
    try {
      await toast.promise(shootAsync(), {
        loading: "Taking shot...",
        success: "Shot taken!",
        error: "Failed to take shot",
      });
    } catch (error) {
      console.error("Error shooting:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-center">
          {[...Array(maxShots)].map((_, i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full mx-1 ${
                i < shotsRemaining ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="relative h-40 w-full bg-muted rounded-lg mb-4">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div
              className="h-20 w-1 bg-primary origin-bottom transform"
              style={{
                transform: `rotate(${heading - 40}deg)`,
                transformOrigin: "bottom center",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button onClick={handleStartGame} disabled={shotsRemaining > 0}>
            Start Game
          </Button>

          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={() => setHeading((prev) => Math.max(0, prev - 1))}
              disabled={shotsRemaining <= 0 || heading <= 0}
            >
              Left
            </Button>
            <Button
              onClick={handleShoot}
              disabled={shotsRemaining <= 0}
              variant="secondary"
            >
              Shoot!
            </Button>
            <Button
              onClick={() => setHeading((prev) => Math.min(80, prev + 1))}
              disabled={shotsRemaining <= 0 || heading >= 80}
            >
              Right
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
