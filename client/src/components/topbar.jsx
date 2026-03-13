export default function TopBar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold">Mercor App</h1>
      <ul>
        <ol>
          <li>
            <a href="/" className="text-white hover:text-gray-300">
              Home
            </a>
          </li>
          <li>
            <a href="/login" className="text-white hover:text-gray-300">
              Login
            </a>
          </li>
          <li>
            <a href="/signup" className="text-white hover:text-gray-300">
              Signup
            </a>
          </li>
        </ol>
      </ul>
    </nav>
  );
}
