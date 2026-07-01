"use client";

import { useState, useEffect } from "react";

const COLORS = [
  { bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5" },
  { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
  { bg: "#fef9c3", text: "#a16207", border: "#fde047" },
  { bg: "#f3e8ff", text: "#7e22ce", border: "#d8b4fe" },
  { bg: "#fce7f3", text: "#be185d", border: "#f9a8d4" },
  { bg: "#e0e7ff", text: "#3730a3", border: "#a5b4fc" },
  { bg: "#ffedd5", text: "#c2410c", border: "#fdba74" },
  { bg: "#ccfbf1", text: "#0f766e", border: "#5eead4" },
  { bg: "#cffafe", text: "#0e7490", border: "#67e8f9" },
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) & 0x7fffffff;
  }
  return h;
}

function getInitials(name: string): string {
  return name
    .split(/[\s/]+/)
    .filter((w) => /^[a-záéíóúàèìòùñüA-Z]/i.test(w))
    .map((w) => w[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();
}

const logoCache = new Map<string, string | null>();

async function fetchWikiLogo(teamName: string): Promise<string | null> {
  if (logoCache.has(teamName)) return logoCache.get(teamName)!;

  // Try to find a Wikipedia page for the team and get its thumbnail
  const title = teamName.replace(/ /g, "_");
  const url =
    `https://en.wikipedia.org/w/api.php?action=query` +
    `&titles=${encodeURIComponent(title)}` +
    `&prop=pageimages&format=json&pithumbsize=240&origin=*`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    const pages = data?.query?.pages as Record<string, { thumbnail?: { source: string } }>;
    if (!pages) throw new Error("no pages");
    const page = Object.values(pages)[0];
    const src = page?.thumbnail?.source ?? null;
    logoCache.set(teamName, src);
    return src;
  } catch {
    logoCache.set(teamName, null);
    return null;
  }
}

const SIZE = {
  sm: { wrapper: "h-8 w-8 text-xs", img: "p-0.5" },
  md: { wrapper: "h-12 w-12 text-sm", img: "p-1" },
  lg: { wrapper: "h-20 w-20 text-xl font-bold", img: "p-1.5" },
};

interface TeamBadgeProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TeamBadge({ name, size = "md", className = "" }: TeamBadgeProps) {
  const [logoUrl, setLogoUrl] = useState<string | null | undefined>(
    logoCache.has(name) ? logoCache.get(name) : undefined,
  );

  useEffect(() => {
    if (!logoCache.has(name)) {
      fetchWikiLogo(name).then(setLogoUrl);
    }
  }, [name]);

  const color = COLORS[hashName(name) % COLORS.length];
  const { wrapper, img } = SIZE[size];

  if (logoUrl) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full border-2 overflow-hidden ${wrapper} ${className}`}
        style={{ borderColor: color.border, backgroundColor: "#fff" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={name}
          className={`h-full w-full object-contain ${img}`}
          onError={() => setLogoUrl(null)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border-2 font-semibold ${wrapper} ${className}`}
      style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
