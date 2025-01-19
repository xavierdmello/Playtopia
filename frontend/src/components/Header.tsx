import logo from "/Playtopia.png";

import { Button } from "./ui/button";
export default function Header() {
  return (
    <div className="flex flex-row bg-accent justify-between mt-0 border-b p-4 border-border">
      <img src={logo} className="w-40 "></img>

      <Button variant="outline">Button</Button>
    </div>
  );
}
