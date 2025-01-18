import logo from "/Playtopia.png";

import { Button } from "./ui/button";
export default function Header() {
  return (
    <div className="flex flex-row bg-accent justify-between mt-0 pt-0">
      <img src={logo} className="w-48 p-4"></img>

      <Button variant="outline">Button</Button>
    </div>
  );
}
