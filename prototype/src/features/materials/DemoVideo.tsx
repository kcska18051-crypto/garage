import { useState } from 'react'
export function DemoVideo({title,poster}:{title:string;poster?:string}) {
 const [preview,setPreview]=useState(false)
 return <section className="material-video" aria-label={`Видео: ${title}`}>
  <div className="material-video__cover" aria-hidden="true">{poster&&<img src={poster} alt=""/>}<span>▶</span></div>
  <button className="material-video__action" type="button" aria-label={preview?`Закрыть превью: ${title}`:`Воспроизвести видео: ${title}`} onClick={()=>setPreview(value=>!value)}><span>{preview?'Закрыть превью':'Смотреть видео'}</span></button>
  {preview&&<p className="material-video__status" role="status">Видео будет доступно после публикации.</p>}
 </section>
}
