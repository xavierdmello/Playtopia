import GameCard from "./GameCard";

interface Game {
  gameName: string;
  imageUrl: string;
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
          key={game.gameName}
          {...game}
          setCurrentPage={setCurrentPage}
        />
      ))}
    </div>
  );
}
