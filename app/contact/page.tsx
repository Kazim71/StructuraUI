import Link from "next/link";
import Logo from "@/components/Logo";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#3f403c] font-sans">
      <header className="w-full bg-[#e0dac9] shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight text-[#3f403c]">StructuraUI</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-[#58554e] hover:text-[#3f403c] transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6 text-[#3f403c]">Contact Sales</h1>
        <p className="text-lg text-[#58554e] leading-relaxed mb-12">
          Interested in learning more about how StructuraUI can accelerate your team's workflow? Reach out to our enterprise specialists.
        </p>
        <div className="h-64 w-full bg-[#e3decd] rounded-sm flex items-center justify-center border border-[#c7bd9b]">
          <span className="text-[#58554e] font-medium">Contact form coming soon...</span>
        </div>
      </main>
    </div>
  );
}
