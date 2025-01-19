import { Heart, Users, Trash2 } from "lucide-react";
import { useContract, useSendTransaction } from "@starknet-react/core";
import { MANAGER_ABI, MANAGER_ADDRESS } from "../../../config";
import { toast } from "sonner";

interface GameCardProps {
  gameId: number;
  gameName: string;
  imageUrl: string;
  likes: number;
  currentPlayers: number;
  setCurrentPage: (page: string) => void;
}

export default function GameCard({
  gameId,
  gameName,
  imageUrl,
  likes,
  currentPlayers,
  setCurrentPage,
}: GameCardProps) {
  const { contract } = useContract({
    abi: MANAGER_ABI,
    address: MANAGER_ADDRESS,
  });

  const { sendAsync: removeGame, isPending } = useSendTransaction({
    calls: contract && [contract.populate("remove_game", [gameId])],
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    if (confirm("Are you sure you want to delete this game?")) {
      try {
        await toast.promise(removeGame(), {
          loading: "Deleting game...",
          success: "Game deleted successfully!",
          error: (err) => `Failed to delete game: ${err.message}`,
        });
      } catch (error) {
        console.error("Error removing game:", error);
      }
    }
  };

  return (
    <div
      className="w-64 rounded-lg overflow-hidden bg-[#1c1c1c] cursor-pointer hover:opacity-80 transition-opacity relative"
      onClick={() => setCurrentPage(gameName)}
    >
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
      >
        <Trash2 className="w-4 h-4 text-white" />
      </button>
      <div className="aspect-square">
        <img
          src={imageUrl}
          alt={gameName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-2">{gameName}</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">{currentPlayers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
