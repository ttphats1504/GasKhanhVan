import {Carousel, Col, Flex, Image, Layout, Row, Typography} from 'antd'
import styles from '@/styles/gascylinder/GasCylinderPage.module.scss'
import FilterSideBar from '../common/FilterSidebar'
import ProductCard from '../common/ProductCard'
import handleAPI from '@/apis/handleAPI'
import Product from '../../../../gkv-admin/src/models/Product'
import {useEffect, useState} from 'react'

const {Title} = Typography

const fetchProductDatas = async () => {
  const api = '/api/products'
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

const GasCylinderPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [banners, setBanners] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const [productRes, bannerRes]: any = await Promise.all([
        fetchProductDatas(),
        fetchBannerImages(),
      ])

      if (productRes?.length) setProducts(productRes)
      if (bannerRes?.length) setBanners(bannerRes.map((b: any) => b.imageUrl))

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <>Loading...</>

  return (
    <div className={styles.wrapper}>
      <Carousel autoplay className={styles.carousel}>
        {banners.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Banner ${index}`} className={styles.carousel_image} />
          </div>
        ))}
      </Carousel>

      <div>
        <Row>
          {[...Array(6)].map((_, idx) => (
            <Col key={idx} span={4}>
              <Image
                className={styles.partner_image}
                src='/assets/partners/petro-gas.png'
                alt='Petro Gas Image'
                preview={false}
              />
            </Col>
          ))}
        </Row>
      </div>

      <div>
        <Row gutter={32}>
          <Col sm={24} md={6}>
            <FilterSideBar title='Filter Category' />
          </Col>
          <Col sm={24} md={18}>
            <Flex vertical>
              <Title level={3}>Gas</Title>
              <Row gutter={[16, 16]}>
                {products.map((cylinder: any) => (
                  <Col key={cylinder.id} xs={24} sm={12} md={8} xxl={6}>
                    <ProductCard product={cylinder} />
                  </Col>
                ))}
              </Row>
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default GasCylinderPage
