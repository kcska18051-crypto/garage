import { useState } from 'react'

export function DemoVideo({ title }: { title: string }) {
  const [playing, setPlaying] = useState(false)
  return <section className={`material-video${playing ? ' is-playing' : ''}`} aria-label={`Видео: ${title}`}>
    <div className="material-video__cover" aria-hidden="true"><i /><span>▶</span></div>
    <button className="material-video__action" type="button" aria-label={playing ? `Приостановить видео: ${title}` : `Воспроизвести видео: ${title}`} onClick={() => setPlaying((value) => !value)}>{playing ? 'Пауза' : 'Смотреть видео'}</button>
    {playing && <p className="material-video__status" role="status">Демонстрационное видео воспроизводится</p>}
  </section>
}
