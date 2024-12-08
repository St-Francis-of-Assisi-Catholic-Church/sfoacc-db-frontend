export default function Header() {
  return (
    <header className="h-[60px] border-b bg-white flex items-center justify-between px-4">
      {/* <h1 className="text-xl font-semibold">Dashboard</h1> */}
      {/* <div>
        <Input
          prefixx={<MagnifyingGlassIcon className="text-primary h-4 w-4" />}
          placeholder="Search"
        />
      </div> */}
      <div></div>

      <button
        className="w-[2.5rem] h-[2.5rem] rounded-full bg-primary text-white flex items-center justify-center font-medium text-lg uppercase"
        aria-label="User profile"
      >
        J
      </button>
      {/* Add user profile, notifications, etc. */}
    </header>
  );
}
