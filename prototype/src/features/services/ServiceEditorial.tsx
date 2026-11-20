import {useId,type ReactNode} from 'react'
import './ServiceEditorial.css'

export function ServiceSection({title,intro,children,className=''}:{title:string;intro?:string;children:ReactNode;className?:string}){
 const id=useId()
 return <section className={`service-editorial-section ${className}`} aria-labelledby={id}><header className="service-editorial-heading"><h2 id={id}>{title}</h2>{intro&&<p>{intro}</p>}</header>{children}</section>
}
export function ServiceProcess({steps}:{steps:{title:string;text:string}[]}){
 return <ol className="service-editorial-process">{steps.map((step,i)=><li key={step.title}><span>{String(i+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
}
export function ServicePriceList({rows,caption,note}:{rows:[string,string][];caption:string;note:string}){
 return <div className="service-editorial-price"><table><caption>{caption}</caption><thead><tr><th scope="col">Вид работ</th><th scope="col">Стоимость</th></tr></thead><tbody>{rows.map(([name,price])=><tr key={name}><th scope="row">{name}</th><td>{price}</td></tr>)}</tbody></table><p>{note}</p></div>
}
