import {Col, Flex, Pagination, Row} from 'antd'
import {Typography} from 'antd'
import Container from '../common/Container'

import styles from '../../styles/home/ProductSection.module.scss'
import ProductCard from '../common/ProductCard'
import handleAPI from '@/apis/handleAPI'
import {useEffect, useState} from 'react'
import Product from '@/models/Product'
import Spinner from '../common/Spinner'

const {Title} = Typography

const fetchProductDatas = async (page = 1, limit = 6) => {
  const api = `/api/products?page=${page}&limit=${limit}`
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Products:', error)
    return null
  }
}

export default function ProductSection() {
  const [cylinders, setCylinders] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const limit = 6 // Products per page

  const fetchData = async (page: number) => {
    setLoading(true)
    const res: any = await fetchProductDatas(page, limit)

    if (res) {
      setCylinders(res.data)
      setTotalItems(res.totalItems)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData(page)
  }, [page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  if (loading) return <Spinner />

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
          <Col key={cylinder.id} xs={24} sm={12} md={6} lg={4}>
            <ProductCard product={cylinder} />
          </Col>
        ))}
      </Row>

      <Flex justify='center' style={{marginTop: '2rem', marginBottom: '2rem'}}>
        <Pagination
          current={page}
          total={totalItems}
          pageSize={limit}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Flex>
    </Container>
  )
}
