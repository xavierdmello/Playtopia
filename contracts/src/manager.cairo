#[starknet::interface]
trait IManager<TContractState> {
    fn create_game(
        ref self: TContractState,
        game_name: felt252,
        contract_address: starknet::ContractAddress,
        thumbnail_url: felt252
    );
    fn get_games(self: @TContractState) -> Array<GameInfo>;
    fn remove_game(ref self: TContractState, game_id: u32);
}

#[derive(Drop, Serde, starknet::Store)]
struct GameInfo {
    game_id: u32,
    game_name: felt252,
    contract_address: starknet::ContractAddress,
    thumbnail_url: felt252,
    likes: u32,
    current_players: u32,
}

#[starknet::contract]
mod Manager {
    use core::array::ArrayTrait;
    use core::starknet::ContractAddress;
    use super::{GameInfo};

    #[storage]
    struct Storage {
        games: LegacyMap<u32, GameInfo>,
        games_count: u32,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.games_count.write(0);
    }

    #[abi(embed_v0)]
    impl ManagerImpl of super::IManager<ContractState> {
        fn create_game(
            ref self: ContractState,
            game_name: felt252,
            contract_address: ContractAddress,
            thumbnail_url: felt252,
        ) {
            let game_id = self.games_count.read() + 1;
            
            let game = GameInfo {
                game_id,
                game_name,
                contract_address,
                thumbnail_url,
                likes: 0,
                current_players: 0,
            };

            self.games.write(game_id, game);
            self.games_count.write(game_id);
        }

        fn get_games(self: @ContractState) -> Array<GameInfo> {
            let mut games = ArrayTrait::new();
            let games_count = self.games_count.read();

            let mut i: u32 = 1;
            loop {
                if i > games_count {
                    break;
                }
                games.append(self.games.read(i));
                i += 1;
            };

            games
        }

        fn remove_game(ref self: ContractState, game_id: u32) {
            let games_count = self.games_count.read();
            assert(game_id <= games_count, 'Invalid game ID');
            
            // Move the last game to the removed position if it's not the last game
            if game_id != games_count {
                let last_game = self.games.read(games_count);
                self.games.write(game_id, last_game);
            }

            self.games_count.write(games_count - 1);
        }
    }
}