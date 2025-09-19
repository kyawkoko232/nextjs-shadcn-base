import { Logout } from "./logout";
import { ModeSwitcher } from "./mode-switcher";

export async function Header() {
  return (
    <header className="absolute top-0 right-0 flex justify-end items-center p-4 w-full">
      <div className="flex items-center gap-2">
        <Logout />
        <ModeSwitcher />
      </div>
    </header>
  );
}
