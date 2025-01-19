import logo from "/Playtopia.png";
import { Button } from "./ui/button";
import { useAccount, useConnect } from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";

export default function Header() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any,
  });

  async function connectWallet() {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    await connect({ connector });
  }

  return (
    <div className="flex flex-row bg-accent justify-between mt-0 border-b p-4 border-border">
      <img src={logo} className="w-40 "></img>

      <div className="flex gap-4">
        <Button variant="outline">Play</Button>
        <Button variant="outline">Stake</Button>
        <Button variant="outline">Create</Button>
      </div>

      <Button variant="outline" onClick={connectWallet}>
        {address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : "Connect Wallet"}
      </Button>
    </div>
  );
}
