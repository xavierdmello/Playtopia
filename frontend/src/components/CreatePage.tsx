import { useState } from "react";
import { Button } from "./ui/button";
import { useContract, useSendTransaction } from "@starknet-react/core";
import { MANAGER_ADDRESS, MANAGER_ABI } from "../../../config";
import { toast } from "sonner";
import { validateThumbnailUrl } from "../utils/validation";

export default function CreatePage() {
  const [gameName, setGameName] = useState("");
  const [contractAddress, setContractAddress] = useState(MANAGER_ADDRESS);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const { contract } = useContract({
    abi: MANAGER_ABI,
    address: MANAGER_ADDRESS,
  });

  const { sendAsync, isPending } = useSendTransaction({
    calls:
      contract && gameName && contractAddress && thumbnailUrl
        ? [
            contract.populate("create_game", [
              gameName,
              contractAddress,
              thumbnailUrl,
            ]),
          ]
        : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName || !contractAddress || !thumbnailUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await toast.promise(sendAsync(), {
        loading: "Creating game...",
        success: "Game created successfully!",
        error: (err) => `Failed to create game: ${err.message}`,
      });
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleThumbnailUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setThumbnailUrl(url);

    const validation = validateThumbnailUrl(url);
    if (!validation.isValid) {
      setUrlError(validation.message);
    } else {
      setUrlError("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Game</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="gameName" className="block text-sm font-medium">
            Game Name
          </label>
          <input
            id="gameName"
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full p-2 rounded-md border border-border bg-background"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contractAddress"
            className="block text-sm font-medium"
          >
            Contract Address
          </label>
          <input
            id="contractAddress"
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-full p-2 rounded-md border border-border bg-background"
            required
            pattern="0x[0-9a-fA-F]+"
            title="Must be a valid hex address starting with 0x"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium">
            Thumbnail URL
          </label>
          <input
            id="thumbnailUrl"
            type="url"
            value={thumbnailUrl}
            onChange={handleThumbnailUrlChange}
            className={`w-full p-2 rounded-md border bg-background ${
              urlError ? "border-red-500" : "border-border"
            }`}
            required
          />
          {urlError && <p className="text-red-500 text-sm">{urlError}</p>}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Game"}
        </Button>
      </form>
    </div>
  );
}
