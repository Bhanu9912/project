import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      {/* FIXED SIDEBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <div className="flex-1 min-h-screen bg-gray-100 md:ml-64 pb-16 md:pb-0">
        {children}
      </div>
    </div>
  );
}
