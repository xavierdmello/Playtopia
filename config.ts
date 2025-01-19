export const MANAGER_ADDRESS =
  "0x025b1eccf30047354c02ce3c5ac78dac887ace8852e5d60c0eebc4e5a64d5d95";

export const GOLF_ADDRESS =
  "0x06d4f7a5897ad67e502457911e4a8f76c2ac7a23e1e80f7e96bdff1756d1b3bd";

export const RPC_URL =
  "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/FtLCTcVJS_yMijFqwztrjaMtvbTtDI8_";

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
