export const MANAGER_ADDRESS =
  "0x06c2f1af2202af6db3f7e4d7c30197406f1f6b202182a075c5062f4366014349";

export const GOLF_ADDRESS = "";

export const MANAGER_ABI = [
  {
    name: "create_game",
    type: "function",
    inputs: [
      { name: "game_name", type: "felt252" },
      { name: "contract_address", type: "ContractAddress" },
      { name: "thumbnail_url", type: "felt252" },
    ],
    outputs: [],
    state_mutability: "external",
  },
  {
    name: "get_games",
    type: "function",
    inputs: [],
    outputs: [
      {
        type: "Array",
        name: "games",
        members: [{ type: "felt252" }],
      },
    ],
    state_mutability: "view",
  },
  {
    name: "remove_game",
    type: "function",
    inputs: [{ name: "game_id", type: "u32" }],
    outputs: [],
    state_mutability: "external",
  },
] as const;

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
