import {Image} from 'antd'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'
import dynamic from 'next/dynamic'
import Brand from '@/models/Brand'
import styles from '@/styles/common/BrandsCarousel.module.scss'
import {useRouter} from 'next/router'

const Slider = dynamic(() => import('react-slick'), {ssr: false})

interface Props {
  brands: Brand[]
  onSelect?: (brandId: number | null) => void
  selectedBrand?: number | null
}

const NextArrow = ({onClick}: any) => (
  <div className='custom-arrow next' onClick={onClick}>
    <RightOutlined />
  </div>
)

const PrevArrow = ({onClick}: any) => (
  <div className='custom-arrow prev' onClick={onClick}>
    <LeftOutlined />
  </div>
)

const BrandsCarousel = ({brands, onSelect, selectedBrand}: Props) => {
  const router = useRouter()

  const handleClickBrand = (brand: Brand, isSelected: boolean) => {
    if (onSelect) onSelect(isSelected ? null : brand.id) // vẫn giữ callback nếu cần
    router.push(`/${brand.slug}`)
  }
  if (!brands || brands.length === 0) return null
  return (
    <div className={styles.brand_container}>
      <Slider
        autoplay
        autoplaySpeed={2000}
        infinite
        slidesToShow={4}
        slidesToScroll={1}
        arrows={true}
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
        dots={false}
        centerMode // 👉 căn giữa các item
        centerPadding='0px' // bỏ padding mặc định
        responsive={[
          {breakpoint: 1200, settings: {slidesToShow: 5}},
          {breakpoint: 992, settings: {slidesToShow: 4}},
          {breakpoint: 768, settings: {slidesToShow: 3}},
          {breakpoint: 480, settings: {slidesToShow: 2}},
        ]}
      >
        {brands.map((brand) => {
          const isSelected = selectedBrand === brand.id
          return (
            <div
              key={brand.id}
              className={`${styles.brand_item} ${isSelected ? styles.brand_item_selected : ''}`}
              onClick={() => handleClickBrand(brand, isSelected)}
            >
              <Image
                src={brand.image}
                alt={brand.name}
                preview={false}
                className={styles.brand_image}
              />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

export default BrandsCarousel
