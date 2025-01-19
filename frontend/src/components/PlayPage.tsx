import GameCard from "./GameCard";
import { Separator } from "./ui/separator";

interface Game {
  gameId: number;
  gameName: string;
  contractAddress: string;
  thumbnailUrl: string;
  likes: number;
  currentPlayers: number;
}

interface PlayPageProps {
  games: Game[];
  setCurrentPage: (page: string) => void;
}

export default function PlayPage({ games, setCurrentPage }: PlayPageProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Available Games</h1>
        <p className="text-muted-foreground">
          Browse and play the latest blockchain games. Click on any game to
          start playing.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.gameId}
            gameId={game.gameId}
            gameName={game.gameName}
            imageUrl={game.thumbnailUrl}
            likes={game.likes}
            currentPlayers={game.currentPlayers}
            setCurrentPage={setCurrentPage}
          />
        ))}
      </div>
    </div>
  );
}
