import {useState} from 'react'
import {CartDialog} from '../cart/CartDialog'
const base='/garage/style-check/review-assets/'
const videos=[
 {id:'overview',title:'Обзор оборудования',image:'catalog-gallery/screw-1.webp'},
 {id:'controls',title:'Панель управления',image:'catalog-gallery/screw-2.webp'},
 {id:'connection',title:'Подключение компрессора',image:'catalog-gallery/screw-3.webp'},
 {id:'service',title:'Техническое обслуживание',image:'screw-compressor-diagnostics.png'},
 {id:'selection',title:'Выбор комплектации',image:'catalog-gallery/screw-2.webp'},
 {id:'installation',title:'Размещение в мастерской',image:'workshop.jpg'},
 {id:'preparation',title:'Подготовка к работе',image:'catalog-gallery/screw-3.webp'},
 {id:'diagnostics',title:'Диагностика оборудования',image:'screw-compressor-diagnostics.png'},
]
function PlayIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 4.8v14.4L20 12z"/></svg>}
export function ProductVideos(){
 const [expanded,setExpanded]=useState(false)
 const [active,setActive]=useState<(typeof videos)[number]|null>(null)
 return <section id="video" className="product-content-section product-videos" aria-label="Видео"><h2>Видео</h2><div id="product-video-grid" className="product-videos__grid">{videos.slice(0,expanded?videos.length:4).map(video=><button key={video.id} type="button" className="product-video-card" onClick={()=>setActive(video)} aria-label={`Предпросмотр видео: ${video.title}`}><span className="product-video-card__cover"><img src={base+video.image} alt="" loading="lazy"/><span className="product-video-card__play"><PlayIcon/></span></span><strong>{video.title}</strong></button>)}</div><p className="product-videos__note">Демонстрационные обложки. Видеоматериалы будут добавлены после согласования.</p><button className="button product-videos__more" type="button" aria-expanded={expanded} aria-controls="product-video-grid" onClick={()=>setExpanded(value=>!value)}>{expanded?'Свернуть':'Показать ещё 4'}</button>{active&&<CartDialog title={active.title} className="product-video-preview" onClose={()=>setActive(null)}><img className="product-video-preview__image" src={base+active.image} alt={`Обложка: ${active.title}`}/><p>Предпросмотр обложки. Видеоролик пока не подключён.</p></CartDialog>}</section>
}
