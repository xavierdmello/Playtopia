import { Heart, Users } from "lucide-react";

interface GameCardProps {
  gameName: string;
  imageUrl: string;
  likes: number;
  currentPlayers: number;
  setCurrentPage: (page: string) => void;
}

export default function GameCard({
  gameName,
  imageUrl,
  likes,
  currentPlayers,
  setCurrentPage,
}: GameCardProps) {
  return (
    <div
      className="w-64 rounded-lg overflow-hidden bg-[#1c1c1c] cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => setCurrentPage(gameName)}
    >
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
