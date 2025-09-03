import {Col, Flex, Pagination, Row, Typography} from 'antd'
import Container from '../common/Container'
import styles from '../../styles/home/ProductSection.module.scss'
import ProductCard from '../common/ProductCard'
import handleAPI from '@/apis/handleAPI'
import {useEffect, useState} from 'react'
import Product from '@/models/Product'
import Spinner from '../common/Spinner'

const {Title} = Typography

type ProductSectionProps = {
  title: string
  categoryId?: number
  brandId?: number // ✅ thêm brandId
  isFeatured?: boolean
}

const fetchProductDatas = async (
  page = 1,
  limit = 6,
  categoryId?: number,
  brandId?: number,
  isFeatured?: boolean
) => {
  let api = `/api/products?page=${page}&limit=${limit}`
  if (categoryId) api += `&typeId=${categoryId}`
  if (brandId) api += `&brandId=${brandId}` // ✅ filter by brand
  if (isFeatured) api += `&featured=true`

  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Products:', error)
    return null
  }
}

export default function ProductSection({
  title,
  categoryId,
  brandId,
  isFeatured,
}: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const limit = 6 // Products per page

  const fetchData = async (page: number) => {
    setLoading(true)

    const res: any = await fetchProductDatas(page, limit, categoryId, brandId, isFeatured)

    if (res) {
      setProducts(res.data)
      setTotalItems(res.totalItems)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData(page)
  }, [page, categoryId, brandId, isFeatured]) // ✅ theo dõi brandId

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  if (loading) return <Spinner />
  if (products.length <= 0) return <></>

  return (
    <Container>
      <Flex vertical>
        <Title level={3} className={styles.product_title}>
          {title}
        </Title>
        <div className={styles.line_break}></div>
      </Flex>

      <Row className={styles.card_wrap} gutter={[16, 16]}>
        {products.map((product: Product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={4}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {totalItems > limit && (
        <Flex justify='center' style={{marginTop: '2rem', marginBottom: '2rem'}}>
          <Pagination
            current={page}
            total={totalItems}
            pageSize={limit}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </Flex>
      )}
    </Container>
  )
}
