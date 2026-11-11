import type {Material} from '../../data/materialsData'
const asset='/garage/style-check/review-assets/'
const pictures:Record<string,string>={
 'news/assortment-update':'workpost-photo.jpg','news/professional-day':'repair-photo.jpg','news/workshop-solutions':'mixing-photo.jpg','news/service-solutions':'workshop.jpg','news/season-equipment':'piston-compressor-diagnostics.png','news/body-repair-materials':'paint-photo.jpg',
 'article/work-area':'about-company-workshop.png','article/paint-materials':'paint-color-automotive.png','article/workshop-layout':'workpost-photo.jpg','article/equipment-setup':'piston-compressor-diagnostics.png','article/tool-maintenance':'tools-photo.jpg','article/compressor-checklist':'screw-compressor-diagnostics.png',
 'review/workshop-solutions':'workshop.jpg','review/compressor-types':'screw-compressor-diagnostics.png','review/lifting-equipment':'about-company-workshop.png','review/body-tools':'repair-photo.jpg','review/paint-zone':'paint-photo.jpg','review/diagnostic-tools':'tools-photo.jpg',
}
export const materialPicture=(item:Material)=>asset+(pictures[`${item.kind}/${item.slug}`]??'workpost-photo.jpg')
export const materialInlinePicture=(item:Material)=>asset+(item.kind==='article'?'workpost-photo.jpg':item.kind==='review'?'about-company-workshop.png':'tools-photo.jpg')
