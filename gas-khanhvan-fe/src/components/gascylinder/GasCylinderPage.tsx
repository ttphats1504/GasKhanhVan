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

const GasCylinderPage = () => {
  const [cylinders, setCylinders] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const res: any = await fetchProductDatas() // Call the function

      if (res && res.length > 0) {
        setCylinders(res)
      }

      setLoading(false)
    }

    fetchData() // Call the async function inside useEffect
  }, [])

  if (loading) return <>Loading...</>

  return (
    <div className={styles.wrapper}>
      <Carousel autoplay className={styles.carousel}>
        <div>
          <h3 className={styles.carousel_item}>1</h3>
        </div>
        <div>
          <h3 className={styles.carousel_item}>2</h3>
        </div>
        <div>
          <h3 className={styles.carousel_item}>3</h3>
        </div>
        <div>
          <h3 className={styles.carousel_item}>4</h3>
        </div>
      </Carousel>
      <div>
        <Row>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src='/assets/partners/petro-gas.png'
              alt='Petro Gas Image'
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src='/assets/partners/petro-gas.png'
              alt='Petro Gas Image'
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src='/assets/partners/petro-gas.png'
              alt='Petro Gas Image'
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src='/assets/partners/petro-gas.png'
              alt='Petro Gas Image'
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src='/assets/partners/petro-gas.png'
              alt='Petro Gas Image'
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src='/assets/partners/petro-gas.png'
              alt='Petro Gas Image'
              preview={false}
            />
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={32}>
          <Col span={6}>
            <FilterSideBar title='Filter Category' />
          </Col>
          <Col span={18}>
            <Flex vertical>
              <Title level={3}>Gas</Title>
              <Row gutter={[16, 16]}>
                {cylinders.map((cylinder) => (
                  <Col key={cylinder.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard cylinder={cylinder} />
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
