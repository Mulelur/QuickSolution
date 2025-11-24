"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const nav = [
    { name: "Dashboard", href: "/" },
    { name: "AI Assistant", href: "/chat" },
    { name: "logs", href: "/logs" },
  ];

  return (
    <>
      {/* Top Header */}
      <div className="text-sm items-center flex gap-4 font-medium border-b bg-gray-50 py-2 px-4">
        <button className="py-1 px-1.5 rounded from-primary to-primary/85 text-primary-foreground border border-zinc-950/25 bg-gradient-to-t shadow-md ring-1 ring-inset ring-white/20 transition duration-200 hover:brightness-110 active:brightness-90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-package-open"
          >
            <path d="M12 22v-9" />
            <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
            <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
            <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
          </svg>
        </button>
        <h1>Quick Solution</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="text-sm font-medium text-center border-b bg-gray-50">
        <ul className="flex flex-wrap -mb-px">
          {nav.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <li key={item.href} className="me-2">
                <Link
                  href={item.href}
                  className={`inline-block p-4 text-fg-brand border-b border-brand rounded-t-base
                    ${
                      isActive
                        ? "active"
                        : "border-transparent hover:text-blue-500 hover:border-blue-500"
                    }
                  `}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
