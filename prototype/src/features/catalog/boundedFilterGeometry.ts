type Input={slotTop:number;boundaryBottom:number;headerBottom:number;viewportHeight:number;naturalHeight:number;gap:number;minHeight:number}
export function boundedFilterGeometry(input:Input){
  const pinTop=input.headerBottom+input.gap
  const reserveHeight=Math.min(input.naturalHeight,Math.max(0,input.viewportHeight-pinTop-input.gap))
  if(input.slotTop>=pinTop)return{fixed:false,top:input.slotTop,height:reserveHeight,reserveHeight}
  const minimum=Math.min(input.minHeight,reserveHeight)
  const height=Math.min(reserveHeight,Math.max(minimum,input.boundaryBottom-pinTop-input.gap))
  return{fixed:true,top:Math.min(pinTop,input.boundaryBottom-input.gap-height),height,reserveHeight}
}
