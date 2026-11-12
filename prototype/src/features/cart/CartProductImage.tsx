import {catalogProducts} from '../../data/catalogData'
import {styleCheckProductPhotos} from '../../data/styleCheckAssets'
import {compressorCategoryImages} from '../catalog/compressorCategoryImages'
import {RoundedIcon} from '../header/RoundedIcon'

export function cartProductPhoto(product:{id:string;name:string}) {
 const catalog=catalogProducts.find(item=>item.id===product.id)
 return styleCheckProductPhotos[product.name] ||
  (catalog?compressorCategoryImages[catalog.subcategoryId]:undefined) ||
  (product.id.startsWith('remeza-vk-10')?compressorCategoryImages['screw-compressors']:undefined) ||
  (product.id==='option-dryer'?'/garage/style-check/review-assets/product-dryer.jpg':undefined) ||
  (product.id==='supply-filter'?'/garage/style-check/review-assets/compressor-categories/filter.webp':undefined)
}
export function CartProductImage({product}:{product:{id:string;name:string}}) {
 const photo=cartProductPhoto(product)
 return photo?<img src={photo} alt="" width="112" height="112" loading="lazy"/>:<span className="cart-photo-pending" role="img" aria-label="Фото уточняется"><RoundedIcon name="catalog"/></span>
}
