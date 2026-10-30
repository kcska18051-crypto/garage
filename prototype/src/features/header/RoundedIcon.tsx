const paths: Record<string, React.ReactNode> = {
  paint: <><path d="M12 3a9 9 0 1 0 0 18h1.4a2.6 2.6 0 0 0 2-4.3 1.5 1.5 0 0 1 1.2-2.5H18a3 3 0 0 0 3-3A8.7 8.7 0 0 0 12 3Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="11" cy="7" r=".8"/><circle cx="15.5" cy="8" r=".8"/><circle cx="7.5" cy="15" r=".8"/></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7c.1.9.4 1.7.7 2.5a2 2 0 0 1-.4 2.1l-1.3 1.3a16 16 0 0 0 4.3 4.3l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.6 2.5.7a2 2 0 0 1 2 2Z" />,
  service: <path d="m14.5 6.5-3.5 3.5 3 3 3.5-3.5a5 5 0 0 1-6 6L6 21a2.1 2.1 0 0 1-3-3l5.5-5.5a5 5 0 0 1 6-6Z" />,
  home: <path d="m4 10 8-7 8 7v10a1 1 0 0 1-1 1h-5v-7h-4v7H5a1 1 0 0 1-1-1Z" />,
  catalog: <>{[[3,3],[14,3],[3,14],[14,14]].map(([x,y]) => <rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" rx="2.2" />)}</>,
  favorite: <path d="M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 8 8-8a5 5 0 0 0 0-7Z" />,
  cart: <><path d="M3 3h2l2.3 11.2A2 2 0 0 0 9.3 16h8.1a2 2 0 0 0 1.9-1.5L21 7H6" /><circle cx="9" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
  profile: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  compare: <><rect x="4" y="10" width="3" height="10" rx="1.5" /><rect x="10.5" y="5" width="3" height="15" rx="1.5" /><rect x="17" y="2" width="3" height="18" rx="1.5" /></>,
  search: <><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5" /></>,
  menu: <path d="M4 5h16M4 12h16M4 19h16" />,
}
export function RoundedIcon({ name }: { name: string }) {
  return <svg className="review-rounded-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
