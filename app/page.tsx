import Link from "next/link";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#3f403c] font-sans selection:bg-[#c7bd9b] selection:text-[#3f403c]">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 w-full bg-[#e0dac9] shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <span className="text-2xl font-bold tracking-tight text-[#3f403c]">StructuraUI</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="/features" className="text-sm font-semibold text-[#58554e] hover:text-[#3f403c] transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-semibold text-[#58554e] hover:text-[#3f403c] transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-semibold text-[#58554e] hover:text-[#3f403c] transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-6">
            <Link 
              href="/login"
              className="text-sm font-bold text-[#58554e] hover:text-[#3f403c] transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/signup"
              className="rounded-sm bg-[#3f403c] px-6 py-2.5 text-sm font-bold text-[#ffffff] hover:bg-[#58554e] focus:outline-none transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 2. Hero */}
        <section className="pt-24 pb-20 lg:pt-32 lg:pb-28 text-center px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold tracking-tight text-[#3f403c] md:text-7xl leading-tight">
              Design with clarity. <br className="hidden md:block"/> Build with purpose.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-[#58554e] max-w-2xl mx-auto leading-relaxed">
              Experience the visual website builder crafted for modern teams. Calm, structured, and profoundly powerful.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto rounded-sm bg-[#3f403c] px-10 py-4 text-lg font-bold text-[#ffffff] hover:bg-[#58554e] transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Features Grid */}
        <section className="py-24 bg-[#f1efe6]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#3f403c]">A deliberate approach to web design.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="rounded-sm bg-[#b6d4c5] p-8 transition-transform hover:-translate-y-1">
                <div className="h-10 w-10 mb-6 rounded-full bg-[#f8f7f3] flex items-center justify-center">
                  <svg className="h-5 w-5 text-[#3f403c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#3f403c]">Generative Canvas</h3>
                <p className="text-sm text-[#58554e] leading-relaxed">
                  Describe your layout in natural language and watch it assemble instantly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-sm bg-[#c7bd9b] p-8 transition-transform hover:-translate-y-1">
                <div className="h-10 w-10 mb-6 rounded-full bg-[#f8f7f3] flex items-center justify-center">
                  <svg className="h-5 w-5 text-[#3f403c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#3f403c]">Visual Editor</h3>
                <p className="text-sm text-[#58554e] leading-relaxed">
                  Precision drag-and-drop tools for absolute control over every pixel.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-sm bg-[#809bce] p-8 transition-transform hover:-translate-y-1">
                <div className="h-10 w-10 mb-6 rounded-full bg-[#f8f7f3] flex items-center justify-center">
                  <svg className="h-5 w-5 text-[#3f403c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#3f403c]">Cloud Sync</h3>
                <p className="text-sm text-[#58554e] leading-relaxed">
                  Automatic, secure saving to our scalable relational database architecture.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-sm bg-[#95b8d1] p-8 transition-transform hover:-translate-y-1">
                <div className="h-10 w-10 mb-6 rounded-full bg-[#f8f7f3] flex items-center justify-center">
                  <svg className="h-5 w-5 text-[#3f403c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#3f403c]">Enterprise Grade</h3>
                <p className="text-sm text-[#58554e] leading-relaxed">
                  Built on modern frameworks for speed, security, and absolute reliability.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="bg-[#e0dac9] pt-16 pb-8 border-t border-[#d1cbb8]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Logo className="h-8 w-8" />
                <span className="text-xl font-bold text-[#3f403c]">StructuraUI</span>
              </div>
              <p className="text-[#58554e] text-sm leading-relaxed">
                A mindful approach to website architecture.
              </p>
            </div>
            
            <div>
              <h4 className="text-[#3f403c] font-bold mb-4 text-sm tracking-wider">Explore</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/features" className="text-[#58554e] hover:text-[#3f403c] transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-[#58554e] hover:text-[#3f403c] transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="text-[#58554e] hover:text-[#3f403c] transition-colors">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#3f403c] font-bold mb-4 text-sm tracking-wider">Connect</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/contact" className="text-[#58554e] hover:text-[#3f403c] transition-colors">Contact Sales</Link></li>
                <li><Link href="/contact" className="text-[#58554e] hover:text-[#3f403c] transition-colors">Support</Link></li>
                <li><Link href="/sitemap" className="text-[#58554e] hover:text-[#3f403c] transition-colors">Sitemap</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#d1cbb8] flex flex-col md:flex-row justify-between items-center text-xs text-[#58554e]">
            <p>&copy; {new Date().getFullYear()} StructuraUI Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
