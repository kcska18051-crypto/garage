import {RoundedIcon} from '../header/RoundedIcon'
const paths:Record<string,React.ReactNode>={
 orders:<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 7h6M9 11h6M9 15h3"/></>,
 organization:<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M10 21v-5h4v5"/></>,
 history:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
 document:<><path d="M14 3H6v18h12V7l-4-4Z"/><path d="M14 3v5h4M9 12h6M9 16h4"/></>,
 star:<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>,
 pin:<><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
 help:<><circle cx="12" cy="12" r="9"/><path d="M9.5 8.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 16h.01"/></>,
 logout:<><path d="M9 3H4v18h5M9 12h12m-4-4 4 4-4 4"/></>,
 arrow:<path d="M5 12h14m-5-5 5 5-5 5"/>,
 chevron:<path d="m6 9 6 6 6-6"/>,
 bonus:<><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/></>,
}
export function ProfileIcon({name}:{name:string}){
 return paths[name]?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>:<RoundedIcon name={name}/>
}
