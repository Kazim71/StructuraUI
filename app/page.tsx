import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-gray-950 text-gray-100 flex flex-col items-center">
      <nav className="w-full max-w-5xl flex justify-end mb-8">
        <Link 
          href="/dashboard"
          className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
        >
          Login / Dashboard
        </Link>
      </nav>

      <header className="w-full max-w-5xl text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Welcome to StructuraUI
        </h1>
        <p className="text-xl text-gray-400">
          The ultimate drag-and-drop website builder backed by Supabase.
        </p>
      </header>

      <section className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Grid Items */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="group rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-sm transition-all hover:border-gray-700 hover:bg-gray-800/50 hover:shadow-md"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                Component {item} <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">-&gt;</span>
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-70">
                Drag and drop this placeholder component into your canvas to start building.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
