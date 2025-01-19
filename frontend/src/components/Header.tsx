import logo from "/Playtopia.png";
import { Button } from "./ui/button";
import { useAccount, useConnect } from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";

interface HeaderProps {
  currentPage: "play" | "stake" | "create";
  setCurrentPage: (page: "play" | "stake" | "create") => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
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
      <div className="flex gap-7 items-center">
        <img
          src={logo}
          className="w-32 cursor-pointer"
          onClick={() => setCurrentPage("play")}
        />
        <button
          className={`${
            currentPage === "play"
              ? "text-white"
              : "text-white/60 hover:text-primary"
          } transition-colors`}
          onClick={() => setCurrentPage("play")}
        >
          Play
        </button>
        <button
          className={`${
            currentPage === "stake"
              ? "text-white"
              : "text-white/60 hover:text-primary"
          } transition-colors`}
          onClick={() => setCurrentPage("stake")}
        >
          Stake
        </button>
        <button
          className={`${
            currentPage === "create"
              ? "text-white"
              : "text-white/60 hover:text-primary"
          } transition-colors`}
          onClick={() => setCurrentPage("create")}
        >
          Create
        </button>
      </div>

      <Button variant="outline" onClick={connectWallet}>
        {address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : "Connect Wallet"}
      </Button>
    </div>
  );
}
