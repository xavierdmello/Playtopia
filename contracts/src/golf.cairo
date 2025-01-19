#[starknet::interface]
trait IGolf<TContractState> {
    fn shoot(ref self: TContractState, heading: u32);
    fn start_game(ref self: TContractState);
    fn change_shots_per_game(ref self: TContractState, new_shots: u32);
    fn change_owner(ref self: TContractState, new_owner: starknet::ContractAddress);
    fn get_shots_per_game(self: @TContractState) -> u32;
    fn get_shots_remaining(self: @TContractState, player: starknet::ContractAddress) -> u32;
    fn get_score(self: @TContractState, player: starknet::ContractAddress) -> u32;
    fn get_player_info(self: @TContractState, player: starknet::ContractAddress) -> Array<felt252>;
    fn score(ref self: TContractState, player: starknet::ContractAddress, points: u32);
    fn miss(ref self: TContractState, player: starknet::ContractAddress);
}

#[starknet::contract]
mod Golf {
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess,
        Vec, VecTrait, MutableVecTrait, Map, StoragePathEntry,
    };
    use core::starknet::{ContractAddress, get_caller_address};
    use core::array::ArrayTrait;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        shots_per_game: u32,
        shots_remaining: Map<ContractAddress, u32>,
        scores: Map<ContractAddress, u32>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Shot: Shot,
        Miss: Miss,
        Scored: Scored,
    }

    #[derive(Drop, starknet::Event)]
    struct Shot {
        #[key]
        player: ContractAddress,
        heading: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct Miss {
        #[key]
        player: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct Scored {
        #[key]
        player: ContractAddress,
        points: u32,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
        self.shots_per_game.write(3); // Default 3 shots per game
    }

    #[abi(embed_v0)]
    impl GolfImpl of super::IGolf<ContractState> {
        fn shoot(ref self: ContractState, heading: u32) {
            let caller = get_caller_address();
            let shots = self.shots_remaining.entry(caller).read();
            assert(shots > 0, 'No shots remaining');
            assert(heading <= 80, 'Invalid heading: too high');
            // Heading is now 0-80, representing -40 to +40 degrees

            // Decrease shots remaining
            self.shots_remaining.entry(caller).write(shots - 1);

            // Emit shot event
            self.emit(Shot { player: caller, heading: heading.into() });
        }

        fn start_game(ref self: ContractState) {
            let caller = get_caller_address();
            let shots = self.shots_per_game.read();
            self.shots_remaining.entry(caller).write(shots);
            self.scores.entry(caller).write(0); // Reset score to 0
        }

        fn change_shots_per_game(ref self: ContractState, new_shots: u32) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can change shots');
            self.shots_per_game.write(new_shots);
        }

        fn change_owner(ref self: ContractState, new_owner: starknet::ContractAddress) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can change owner');
            self.owner.write(new_owner);
        }

        fn get_shots_per_game(self: @ContractState) -> u32 {
            self.shots_per_game.read()
        }

        fn get_shots_remaining(self: @ContractState, player: ContractAddress) -> u32 {
            self.shots_remaining.entry(player).read()
        }

        fn get_score(self: @ContractState, player: ContractAddress) -> u32 {
            self.scores.entry(player).read()
        }

        fn get_player_info(self: @ContractState, player: ContractAddress) -> Array<felt252> {
            let mut info = ArrayTrait::new();
            
            // Get all the values
            let shots_per_game = self.shots_per_game.read();
            let shots_remaining = self.shots_remaining.entry(player).read();
            let score = self.scores.entry(player).read();
            
            // Add them to the array as felt252
            info.append(shots_per_game.into());
            info.append(shots_remaining.into());
            info.append(score.into());
            
            info
        }

        fn score(ref self: ContractState, player: ContractAddress, points: u32) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can score');
            
            let current_score = self.scores.entry(player).read();
            self.scores.entry(player).write(current_score + points);
            
            self.emit(Scored { player, points });
        }

        fn miss(ref self: ContractState, player: ContractAddress) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can call miss');
            
            self.emit(Miss { player });
        }
    }
}