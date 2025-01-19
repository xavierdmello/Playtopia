import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/button";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { GOLF_ABI, GOLF_ADDRESS, RPC_URL } from "../../../../config";
import { RpcProvider } from "starknet";
import { toast } from "sonner";

export default function MiniGolf() {
  const [heading, setHeading] = useState(40); // Start at center (0 degrees)
  const [shotsRemaining, setShotsRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const { address } = useAccount();
  const [maxShots, setMaxShots] = useState(3);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const provider = new RpcProvider({
    nodeUrl: RPC_URL,
  });

  const { contract } = useContract({
    abi: GOLF_ABI,
    address: GOLF_ADDRESS,
  });

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
      const response = await provider.callContract({
        contractAddress: GOLF_ADDRESS,
        entrypoint: "get_player_info",
        calldata: [address],
      });

      const maxShotsValue = Number(BigInt(response[1]));
      const remainingShots = Number(BigInt(response[2]));
      const playerScore = Number(BigInt(response[3]));

      setMaxShots(maxShotsValue);
      setShotsRemaining(remainingShots);
      setScore(playerScore);
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

  // Fetch available video input devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    getDevices();
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
      {/* Webcam Background */}
      {selectedDeviceId && (
        <Webcam
          className="absolute top-0 left-0 w-full h-full object-cover"
          videoConstraints={{
            deviceId: selectedDeviceId,
            width: 1280,
            height: 720,
            facingMode: "user", // "environment" for rear camera
          }}
        />
      )}

      {/* Overlay UI */}
      <div className="absolute flex flex-col items-center gap-8 p-8 z-10">
        <div className="w-full max-w-md">
          {/* Device Selection */}
          <div className="mb-4 text-white">
            <label htmlFor="deviceSelect" className="mr-2">Choose Webcam:</label>
            <select
              id="deviceSelect"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="bg-gray-800 text-white rounded p-2"
            >
              {devices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          {shotsRemaining === 0 && (
            <div className="text-center mb-4 text-lg font-medium text-white">
              Hit Start Game when ready
            </div>
          )}
          <div className="mb-4">
            {shotsRemaining > 0 && (
              <div className="flex justify-center items-center gap-2 text-white">
                <span className="text-sm font-medium">Shots remaining:</span>
                <div className="flex">
                  {[...Array(maxShots)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 w-4 rounded-full mx-1 ${
                        i < shotsRemaining ? "bg-white" : "bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ticker */}
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
    </div>
  );
}
