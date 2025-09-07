import {Carousel, Col, Empty, Flex, Image, Layout, Row, Typography} from 'antd'
import styles from '@/styles/gascylinder/GasCylinderPage.module.scss'
import FilterSideBar from '../common/FilterSidebar'
import ProductCard from '../common/ProductCard'
import handleAPI from '@/apis/handleAPI'
import Product from '../../../../gkv-admin/src/models/Product'
import {useEffect, useState} from 'react'
import Spinner from '../common/Spinner'
import Category from '@/models/Category'
import Brand from '@/models/Brand'
import Slider from 'react-slick'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'

interface Props {
  cate: Category
}

const {Title} = Typography

const fetchProductDatas = async () => {
  const api = `/api/products`
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Products:', error)
    return []
  }
}

const fetchProductDatasByCateId = async (categoryId: number) => {
  const api = `/api/products?typeId=${categoryId}`
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Products:', error)
    return []
  }
}

const fetchCategoryById = async (categoryId: number) => {
  const api = `/api/categories/${categoryId}`
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Products:', error)
    return []
  }
}

const fetchBannerImages = async () => {
  const api = '/api/banners'
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Banners:', error)
    return []
  }
}

const GasCylinderPage = ({cate}: Props) => {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>()
  const [banners, setBanners] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [brands, setBrands] = useState<Brand[]>([])

  const NextArrow = (props: any) => {
    const {className, onClick} = props
    return <div className={className} onClick={onClick}></div>
  }

  const PrevArrow = (props: any) => {
    const {className, onClick} = props
    return <div className={className} onClick={onClick}></div>
  }

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res: any = await handleAPI('/api/brands', 'get')
        setBrands(res?.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBrands()
  }, [])

  useEffect(() => {
    setProducts([])
    setBanners([])
    setCategory(null)
    const fetchData = async () => {
      setLoading(true)

      if (cate) {
        const isSanPham = cate.slug === 'san-pham'

        const [productRes, bannerRes, cateRes]: any = await Promise.all([
          isSanPham ? fetchProductDatas() : fetchProductDatasByCateId(cate.id),
          fetchBannerImages(),
          fetchCategoryById(cate.id),
        ])

        if (productRes?.totalItems) setProducts(productRes.data)
        if (cateRes) setCategory(cateRes)
        if (bannerRes?.length) setBanners(bannerRes.map((b: any) => b.image))
      }

      setLoading(false)
    }

    fetchData()
  }, [cate.id])

  if (loading) return <Spinner />
  return (
    <div className={styles.wrapper}>
      <Carousel autoplay className={styles.carousel}>
        {banners.map((url, index) => (
          <div key={index}>
            <Image src={url} alt={`Banner ${index}`} className={styles.carousel_image} />
          </div>
        ))}
      </Carousel>

      <div className={styles.partner_slider}>
        <Slider
          autoplay
          autoplaySpeed={2000}
          infinite
          slidesToShow={6}
          slidesToScroll={1}
          arrows={true} // bật arrow
          nextArrow={<NextArrow />} // arrow next
          prevArrow={<PrevArrow />} // arrow prev
          dots={false}
          responsive={[
            {breakpoint: 1200, settings: {slidesToShow: 5}},
            {breakpoint: 992, settings: {slidesToShow: 4}},
            {breakpoint: 768, settings: {slidesToShow: 3}},
            {breakpoint: 480, settings: {slidesToShow: 2}},
          ]}
        >
          {brands.map((brand) => (
            <div key={brand.id}>
              <Image
                src={brand.image}
                alt={brand.name}
                preview={false}
                className={styles.partner_image}
              />
            </div>
          ))}
        </Slider>
      </div>

      <div>
        <Row gutter={32}>
          {/* Sidebar */}
          <Col xs={24} md={6}>
            <FilterSideBar title='Danh mục sản phẩm' />
          </Col>

          {/* Content */}
          <Col xs={24} md={18}>
            <Flex vertical>
              {category && <Title level={3}>{category.name}</Title>}
              <Row gutter={[16, 16]}>
                {products.length > 0 ? (
                  products.map((cylinder: any) => (
                    <Col key={cylinder.id} xs={12} sm={12} md={8} lg={8} xl={8} xxl={6}>
                      <ProductCard product={cylinder} />
                    </Col>
                  ))
                ) : (
                  <Empty description={<>Chưa có sản phẩm nào</>} />
                )}
              </Row>
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default GasCylinderPage
