import { ThemeToggler } from "../theme-toggler";

export default function Header() {
  return (
    <>
      <div className="w-full p-4 grid grid-cols-2 mt-5">
        <div className="w-full align-middle">Home</div>
        <div className="w-full flex justify-end">
          <ThemeToggler />
        </div>
      </div>
    </>
  );
}
