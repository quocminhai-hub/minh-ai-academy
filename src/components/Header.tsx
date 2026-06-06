'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const navLinks = [
  { href: '/courses', label: 'Khóa học' },
  { href: '/blog', label: 'Blog' },
  { href: '/community', label: 'Cộng đồng' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/minh-avatar.png"
            alt="Minh AI Academy"
            width={36}
            height={36}
            className="w-9 h-9 rounded-lg object-cover"
          />
          <div>
            <div className="text-sm font-bold leading-tight">Minh AI Academy</div>
            <div className="text-[10px] text-[#0EA5E9] leading-tight">AI dễ lắm</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 bg-white/5 rounded-lg animate-pulse" />
          ) : user ? (
            <Link href="/dashboard" className="btn-secondary text-sm py-2 px-5 flex items-center gap-2">
              <span>👤</span> {user.user_metadata?.full_name || 'Học viên'}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Đăng nhập
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-5">
                🚀 Bắt đầu miễn phí
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a0a0f]/98 backdrop-blur-xl border-t border-white/5 px-4 pb-6 pt-4 space-y-3 animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="block text-sm text-gray-300 hover:text-white py-2 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <div className="pt-3 border-t border-white/5 space-y-2">
            {loading ? (
              <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />
            ) : user ? (
              <Link href="/dashboard" className="btn-secondary text-sm py-2.5 px-5 w-full justify-center" onClick={() => setIsMenuOpen(false)}>
                👤 {user.user_metadata?.full_name || 'Học viên'}
              </Link>
            ) : (
              <>
                <Link href="/login" className="block text-sm text-gray-400 py-2 text-center" onClick={() => setIsMenuOpen(false)}>
                  Đăng nhập
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2.5 px-5 w-full justify-center" onClick={() => setIsMenuOpen(false)}>
                  🚀 Bắt đầu miễn phí
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

