import logo from "/Playtopia.png";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex flex-row bg-accent justify-between mt-0 border-b p-4 border-border">
      <img src={logo} className="w-40 "></img>

      <div className="flex gap-4">
        <Button variant="outline">Play</Button>
        <Button variant="outline">Stake</Button>
        <Button variant="outline">Create</Button>
      </div>
      
      <Button variant="outline">Button</Button>
    </div>
  );
}
