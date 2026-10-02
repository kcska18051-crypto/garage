import { useState } from 'react'

export function DemoVideo({ title }: { title: string }) {
  const [playing, setPlaying] = useState(false)
  return <section className={`material-video${playing ? ' is-playing' : ''}`} aria-label={`Видео: ${title}`}>
    <div aria-hidden="true"><i /><span>▶</span></div>
    <div><small>Видео · демонстрационный материал</small><h2>{title}</h2>{playing && <p role="status">Демонстрационное видео воспроизводится</p>}<button type="button" aria-label={playing ? 'Приостановить видео' : `Воспроизвести видео: ${title}`} onClick={() => setPlaying((value) => !value)}>{playing ? 'Пауза' : 'Смотреть видео'}</button></div>
  </section>
}
