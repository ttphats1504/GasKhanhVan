import {Col, Flex, Row} from 'antd'
import {Typography} from 'antd'
import Container from '../common/Container'

import styles from '../../styles/home/ProductSection.module.scss'
import ProductCard from '../common/ProductCard'
import handleAPI from '@/apis/handleAPI'
import {useEffect, useState} from 'react'
import Product from '@/models/Product'

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

export default function ProductSection() {
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
    <Container>
      <Flex justify='center' align='center'>
        <Title level={2} className={styles.title}>
          SẢN PHẨM
        </Title>
        <div className={styles.border}></div>
      </Flex>
      <Flex vertical>
        <Title level={3} className={styles.product_title}>
          Khuyến mãi hôm nay
        </Title>
        <div className={styles.line_break}></div>
      </Flex>
      <Row className={styles.card_wrap} gutter={[24, 24]}>
        {cylinders.map((cylinder: any) => (
          <Col key={cylinder.id} xs={24} sm={8} md={4}>
            <ProductCard cylinder={cylinder} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}
