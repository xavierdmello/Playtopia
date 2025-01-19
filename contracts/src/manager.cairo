#[starknet::interface]
trait IManager<TContractState> {
    fn create_game(
        ref self: TContractState,
        game_name: felt252,
        contract_address: starknet::ContractAddress,
        thumbnail_url: felt252
    );
    fn get_games(self: @TContractState) -> Array<felt252>;
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
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess,
        Vec, VecTrait, MutableVecTrait, Map, StoragePathEntry,
    };
    use core::starknet::{ContractAddress, get_caller_address};
    use core::array::ArrayTrait;
    use super::{GameInfo};

    #[storage]
    struct Storage {
        games: Map<u32, GameInfo>,
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

            self.games.entry(game_id).write(game);
            self.games_count.write(game_id);
        }

        fn get_games(self: @ContractState) -> Array<felt252> {
            let mut games = ArrayTrait::new();
            let games_count = self.games_count.read();

            let mut i: u32 = 1;
            loop {
                if i > games_count {
                    break;
                }
                let game = self.games.entry(i).read();
                games.append(game.game_id.into());
                games.append(game.game_name);
                games.append(game.contract_address.into());
                games.append(game.thumbnail_url);
                games.append(game.likes.into());        // Add this line
                games.append(game.current_players.into());
                i += 1;
            };

            games
        }

        fn remove_game(ref self: ContractState, game_id: u32) {
            let games_count = self.games_count.read();
            assert(game_id <= games_count, 'Invalid game ID');
            
            // Move the last game to the removed position if it's not the last game
            if game_id != games_count {
                let last_game = self.games.entry(games_count).read();
                self.games.entry(game_id).write(last_game);
            }

            self.games_count.write(games_count - 1);
        }
    }
}