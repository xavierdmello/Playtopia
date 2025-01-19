import GameCard from "./GameCard";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
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
  );
}
