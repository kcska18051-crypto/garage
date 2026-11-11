import type {StoreAction} from '../../data/actionsData'
const photos:Record<string,string>={a:'about-company-workshop.png',b:'tools-photo.jpg',c:'screw-compressor-diagnostics.png',d:'paint-photo.jpg'}
export const actionPicture=(action:StoreAction)=>'/garage/style-check/review-assets/'+(photos[action.cardImage]??'workpost-photo.jpg')
