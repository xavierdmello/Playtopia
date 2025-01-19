import { useState } from "react";
import Header from "./components/Header";
import PlayPage from "./components/PlayPage";
import { useTheme } from "./components/theme-provider";
import { useAccount } from "@starknet-react/core";
import { useReadContract, useNetwork } from "@starknet-react/core";
import { MANAGER_ABI, MANAGER_ADDRESS } from "../../config";
// Example games data - you can replace this with real data
const SAMPLE_GAMES = [
  {
    gameName: "Sample Game 1",
    imageUrl:
      "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/7/f/7/7f7ef7c4ef3df25ce19131d411ff830ba9767c21.png",
    likes: 150,
    currentPlayers: 23,
  },
  // Add more games as needed
];

function App() {
  const { setTheme } = useTheme();
  const { address, status } = useAccount();
  const [currentPage, setCurrentPage] = useState<string>("play");
  const { chain } = useNetwork();
  //      [
  //       {
  //         name: "mint",
  //         type: "function",
  //         inputs: [{ name: "amount", type: "u256" }],
  //         outputs: [],
  //         stateMutability: "external",
  //       },
  //     ],

  const { data, error } = useReadContract({
    abi: [
      {
        name: "get_games",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "Array",
            name: "games",
            members: [
              { name: "game_id", type: "u32" },
              { name: "game_name", type: "felt252" },
              { name: "contract_address", type: "ContractAddress" },
              { name: "thumbnail_url", type: "felt252" },
              { name: "likes", type: "u32" },
              { name: "current_players", type: "u32" },
            ],
          },
        ],
        state_mutability: "view",
      },
    ] as const,
    functionName: "get_games",
    address: MANAGER_ADDRESS,
    args: [],
  });
  console.log(data);
  setTheme("dark");

  return (
    <div className="container m-auto max-w-5xl mt-[10px] border border-border">
      <Header
        currentPage={currentPage as "play" | "stake" | "create"}
        setCurrentPage={setCurrentPage}
      />

      <div className="p-4">
        {status === "connected" ? (
          <>
            {currentPage === "play" && (
              <PlayPage games={SAMPLE_GAMES} setCurrentPage={setCurrentPage} />
            )}
            {currentPage === "stake" && <div>Stake Page</div>}
            {currentPage === "create" && <div>Create Page</div>}
            {currentPage !== "play" &&
              currentPage !== "stake" &&
              currentPage !== "create" && <div>Game: {currentPage}</div>}
          </>
        ) : (
          <div className="m-12 justify-center align-middle flex">
            Please connect your wallet.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
