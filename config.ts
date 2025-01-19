export const MANAGER_ADDRESS =
  "0x00e14f7e39cd7e771d6a250fb6ca503646eee3006bbd7a96ffdd2dbb2eb3e820";

export const GOLF_ADDRESS =
  "0x05e453ddbe167ef94751321673959754b1242a52d11336593fe418239b0394aa";

export const RPC_URL = "http://localhost:5050";

export const MANAGER_ABI = [
  {
    name: "create_game",
    type: "function",
    inputs: [
      { name: "game_name", type: "felt252" },
      {
        name: "contract_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
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

// ... existing code ...

export const GOLF_ABI = [
  {
    name: "shoot",
    type: "function",
    inputs: [{ name: "heading", type: "u32" }],
    outputs: [],
    state_mutability: "external",
  },
  {
    name: "start_game",
    type: "function",
    inputs: [],
    outputs: [],
    state_mutability: "external",
  },
  {
    name: "change_shots_per_game",
    type: "function",
    inputs: [{ name: "new_shots", type: "u32" }],
    outputs: [],
    state_mutability: "external",
  },
  {
    name: "change_owner",
    type: "function",
    inputs: [
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [],
    state_mutability: "external",
  },
  {
    name: "get_shots_per_game",
    type: "function",
    inputs: [],
    outputs: [{ name: "shots", type: "u32" }],
    state_mutability: "view",
  },
  {
    name: "get_shots_remaining",
    type: "function",
    inputs: [
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [{ name: "shots", type: "u32" }],
    state_mutability: "view",
  },
  {
    name: "get_score",
    type: "function",
    inputs: [
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [{ name: "score", type: "u32" }],
    state_mutability: "view",
  },
  {
    name: "get_player_info",
    type: "function",
    inputs: [
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [
      {
        type: "Array",
        name: "info",
        members: [{ type: "felt252" }],
      },
    ],
    state_mutability: "view",
  },
  {
    name: "score",
    type: "function",
    inputs: [
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "points", type: "u32" },
    ],
    outputs: [],
    state_mutability: "external",
  },
  {
    name: "miss",
    type: "function",
    inputs: [
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [],
    state_mutability: "external",
  },
] as const;
