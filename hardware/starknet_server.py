import asyncio
from starknet_py.net.full_node_client import FullNodeClient
import controller
import time
import serial
from starknet_py.hash.selector import get_selector_from_name
from starknet_py.net.client_models import Call
from starknet_py.net.signer.stark_curve_signer import KeyPair, StarkCurveSigner
from starknet_py.net.models import StarknetChainId
from starknet_py.net.account.account import Account

# Constants from config.ts
GOLF_ADDRESS = "0x006cef006bb13b6f090c7c3a1a4d784b786d5f53ade740e2493a8aef53aff580"
RPC_URL = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/FtLCTcVJS_yMijFqwztrjaMtvbTtDI8_"
PRIVATE_KEY = 0x00000000000000000000000000000000b137668388dbe9acdfa3bc734cc2c469

async def monitor_shot():
    # Initialize Starknet client
    client = FullNodeClient(node_url=RPC_URL)
    
    # Initialize key pair and signer
    key_pair = KeyPair.from_private_key(PRIVATE_KEY)
    
    # Create account instance
    
    ACCOUNT_ADDRESS = "0x034ba56f92265f0868c57d3fe72ecab144fc96f97954bbbc4252cef8e8a979ba"
    account = Account(
        client=client,
        address=int(ACCOUNT_ADDRESS, 16),  # Convert hex string to int
        key_pair=key_pair,
        chain=StarknetChainId.SEPOLIA
    )

    print(f"Starting to monitor shots on contract: {GOLF_ADDRESS}")

    while True:
        try:
            # Call get_player_info to check shot status
            call = Call(
                to_addr=int(GOLF_ADDRESS, 16),  # Convert hex string to int
                selector=get_selector_from_name("get_player_info"),
                calldata=[0]  # Zero address to get global state
            )
            response = await client.call_contract(call=call)

            # Skip first value (array length)
            # Index 3 is has_shot (bool), index 4 is last_heading
            has_shot = bool(int(response[4]))
            last_heading = int(response[5])

            if has_shot:
                print(f"Shot detected! Heading: {last_heading}")

                # Convert heading from 0-80 range to -40 to 40 range
                pivot_angle = last_heading - 40
                print("pivot angle", pivot_angle)
                
                # Wait for servo to move into position
                time.sleep(1)
                print("swing command")

                # Score the shot using the account to sign the transaction
                score_call = Call(
                    to_addr=int(GOLF_ADDRESS, 16),
                    selector=0x13765824cbeef1794ad2abf56eeaec6b82649f55c3773b8022b209982e4720,
                    calldata=[int(ACCOUNT_ADDRESS, 16), 1]  # [player_address, points]
                )
                
                # Execute the signed transaction with auto_estimate
                response = await account.execute_v3(
                    calls=[score_call],  # Wrap single call in list
                    auto_estimate=True
                )
                await response.wait_for_acceptance()
                print("Scored shot!")
                
                # Break after processing the shot
                break

            # Wait before polling again
            await asyncio.sleep(0.5)

        except Exception as e:
            print(f"Error in shot monitoring: {e}")
            await asyncio.sleep(1)  # Wait longer on error before retrying

if __name__ == "__main__":
    try:
        asyncio.run(monitor_shot())
    except KeyboardInterrupt:
        print("\nShutting down server...")
    except Exception as e:
        print(f"Fatal error: {e}")