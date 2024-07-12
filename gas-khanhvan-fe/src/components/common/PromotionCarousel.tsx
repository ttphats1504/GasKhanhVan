import {Carousel} from 'antd'

import styles from '../../styles/common/PromotionCarousel.module.scss'

const PromotionCarousel = () => {
  return (
    <>
      <Carousel arrows infinite={false} autoplay>
        <div>
          <h3 className={styles.content}>1</h3>
        </div>
        <div>
          <h3 className={styles.content}>2</h3>
        </div>
        <div>
          <h3 className={styles.content}>3</h3>
        </div>
        <div>
          <h3 className={styles.content}>4</h3>
        </div>
      </Carousel>
    </>
  )
}

export default PromotionCarousel
