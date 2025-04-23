import {Carousel, Image} from 'antd'
import {useEffect, useState} from 'react'
import handleAPI from '@/apis/handleAPI'
import styles from '../../styles/common/PromotionCarousel.module.scss'
import Banner from '@/models/Banner'

const PromotionCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res: any = await handleAPI('/api/banners', 'get')
        if (res?.length) {
          // Sort banners by `order` before displaying (optional but likely desired)
          setBanners(res.sort((a: any, b: any) => a.order - b.order))
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
      }
    }

    fetchBanners()
  }, [])

  return (
    <div className={styles.content}>
      <Carousel autoplay>
        {banners.map((banner) => (
          <div key={banner.id}>
            <Image
              src={banner.image}
              alt={`Banner ${banner.id}`}
              preview={false}
              className={styles.image_content}
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default PromotionCarousel
