import asyncio
from starknet_py.net.full_node_client import FullNodeClient
from starknet_py.net.client_models import Event
import controller
import time
import serial

# Constants from config.ts
GOLF_ADDRESS = "0x06d4f7a5897ad67e502457911e4a8f76c2ac7a23e1e80f7e96bdff1756d1b3bd"
RPC_URL = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/FtLCTcVJS_yMijFqwztrjaMtvbTtDI8_"

async def monitor_events():
    # Initialize Starknet client
    client = FullNodeClient(node_url=RPC_URL)
    
    # # Initialize Arduino connection
    # try:
    #     arduino = controller.initialize_serial_connection()
    # except serial.SerialException as e:
    #     print(f"Failed to connect to Arduino: {e}")
    #     return

    print(f"Starting to monitor Shot events on contract: {GOLF_ADDRESS}")

    # Keep track of the last block we processed
    try:
        last_block = await client.get_block_number()
        print(f"Starting from block number: {last_block}")
    except Exception as e:
        print(f"Error getting initial block number: {e}")
        return

    while True:
        try:
            # Get current block
            current_block = await client.get_block_number()

            # Check for new blocks
            if current_block > last_block:
                try:
                    # Get block with transactions
                    block = await client.get_block(block_number=current_block)

                    # Process each transaction in the block
                    for tx in block.transactions:
                        try:
                            # Get transaction receipt which contains events
                            receipt = await client.get_transaction_receipt(tx.hash)
                            
                            # Look for Shot events
                            for event in receipt.events:
                                # print(f"Event found: keys={event.keys}, data={event.data}")  # Debug print

                                if (event.from_address == int(GOLF_ADDRESS, 16)):
                                    print(len(event.keys))
                                    event_keys_hex = [hex(key) for key in event.keys]
                                    print("Event keys in hex:", event_keys_hex)
                               
                                    
                                    # Extract heading from event
                                    heading = int(event.data[1])  # Second parameter is heading
                                    print(f"Shot event detected! Heading: {heading}")

                                    # Convert heading from 0-80 range to -40 to 40 range
                                    pivot_angle = heading - 40

                                    # Send pivot command
                                    # controller.send_pivot_command(arduino, pivot_angle)
                                    print("pivot angle", pivot_angle)
                                    
                                    # Wait for servo to move into position
                                    time.sleep(1)
                                    
                                    # Send swing command
                                    # controller.send_swing_command(arduino)
                                    print("swing command")

                        except Exception as tx_error:
                            print(f"Error processing transaction {tx.hash}: {tx_error}")
                            continue

                    last_block = current_block
                    print(f"Processed block {current_block}")

                except Exception as block_error:
                    if "Block not found" in str(block_error):
                        print(f"Block {current_block} not available yet, waiting...")
                        await asyncio.sleep(1)
                        continue
                    else:
                        print(f"Error processing block {current_block}: {block_error}")
                        await asyncio.sleep(1)
                        continue

            # Wait before checking for new blocks
            await asyncio.sleep(1)

        except Exception as e:
            print(f"Error in event monitoring: {e}")
            await asyncio.sleep(1)  # Wait longer on error before retrying

if __name__ == "__main__":
    try:
        asyncio.run(monitor_events())
    except KeyboardInterrupt:
        print("\nShutting down server...")
    except Exception as e:
        print(f"Fatal error: {e}")