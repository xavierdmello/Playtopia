export const MANAGER_ADDRESS =
  "0x01166b6172368c10548207dd9cf5a32f0f4c4e9302c0005c394dc328949d32e7";

export const GOLF_ADDRESS = "";

export const MANAGER_ABI = [
  {
    name: "create_game",
    type: "function",
    inputs: [
      { name: "game_name", type: "felt252" },
      { name: "contract_address", type: "starknet::ContractAddress" },
      { name: "thumbnail_url", type: "felt252" },
    ],
    outputs: [],
    stateMutability: "external",
  },
  {
    name: "get_games",
    type: "function",
    inputs: [],
    outputs: [],
    stateMutability: "view",
  },
  {
    name: "remove_game",
    type: "function",
    inputs: [{ name: "game_id", type: "u32" }],
    outputs: [],
    stateMutability: "external",
  },
];

export const GOLF_ABI = [] as const;

//      [
//       {
//         name: "mint",
//         type: "function",
//         inputs: [{ name: "amount", type: "u256" }],
//         outputs: [],
//         stateMutability: "external",
//       },
//     ],

//   fn create_game(
//     ref self: TContractState,
//     game_name: felt252,
//     contract_address: starknet::ContractAddress,
//     thumbnail_url: felt252
// );
// fn get_games(self: @TContractState) -> Array<GameInfo>;
// fn remove_game(ref self: TContractState, game_id: u32);
