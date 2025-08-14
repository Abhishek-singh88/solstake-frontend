'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Staking', href: '/staking' },
  { name: 'Learn & Earn', href: '/learn-earn' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-lg bg-slate-900/70 border-b border-slate-700/50">
      {/* 1-pixel gradient accent */}
      <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </span>
            <span className="text-xl font-bold text-white">Solstake</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-10">
            {navItems.map(({ name, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={`relative text-sm font-medium transition-colors duration-200
                    ${active ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-300'}
                  `}
                >
                  {name}
                  {/* active underline */}
                  {active && (
                    <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/90 backdrop-blur-lg border-t border-slate-700/50">
          <ul className="px-4 py-4 space-y-2">
            {navItems.map(({ name, href }) => {
              const active = pathname === href;
              return (
                <li key={name}>
                  <Link
                    href={href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                      ${active
                        ? 'text-emerald-400 bg-slate-800/60'
                        : 'text-slate-300 hover:text-emerald-300'}
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
