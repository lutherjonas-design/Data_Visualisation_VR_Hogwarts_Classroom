import Navbar from "../components/Navbar/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-custom-bg text-custom-text">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-6">
        {children}
      </main>
    </div>
  );
}
