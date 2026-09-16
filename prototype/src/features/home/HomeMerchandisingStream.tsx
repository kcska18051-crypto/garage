import { Fragment } from 'react'
import type { HomeMerchandisingBlock, ProductCollection, PromoBanner } from '../../data/types'
import { ProductShowcase } from '../products/ProductShowcase'
import { DividerBanner } from './DividerBanner'
import './HomeMerchandisingStream.css'

type Props = {
  blocks: HomeMerchandisingBlock[]
  collections: ProductCollection[]
  banners: PromoBanner[]
}

export function HomeMerchandisingStream({ blocks, collections, banners }: Props) {
  return <div className="home-merchandising-stream">
    {blocks.filter((block) => block.visible).map((block) => {
      const collection = collections.find((item) => item.id === block.collectionId)
      if (!collection) return null
      const blockBanners = block.bannerIds
        .map((id) => banners.find((item) => item.id === id))
        .filter((item): item is PromoBanner => Boolean(item))

      return <Fragment key={block.id}>
        <ProductShowcase collection={collection} />
        {blockBanners.length > 0 && <div className={`compact-banner-group compact-banner-group--${blockBanners.length}`}>
          {blockBanners.map((banner, index) => <DividerBanner key={banner.id} item={banner} index={index} />)}
        </div>}
      </Fragment>
    })}
  </div>
}
