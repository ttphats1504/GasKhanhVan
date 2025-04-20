import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Image,
  Spin,
  Tabs,
  Badge,
  Space,
  Tag,
  Divider,
  Breadcrumb,
} from 'antd'
import {ShoppingCartOutlined} from '@ant-design/icons'
import MainLayout from '@/layouts/MainLayout'
import ProductCard from '@/components/common/ProductCard'
import handleAPI from '@/apis/handleAPI'
import Product from '@/models/Product'

const {Title, Text, Paragraph} = Typography
const {TabPane} = Tabs

const fetchProductById = async (id: string | string[]) => {
  const api = `/api/products/${id}`
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Product by Id:', error)
    return []
  }
}

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

const ProductDetail: React.FC = () => {
  const router = useRouter()
  const {id} = router.query
  const [cylinders, setCylinders] = useState<Product[]>([])
  const [cylinder, setCylinder] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch data from the backend
  useEffect(() => {
    const fetchDatas = async () => {
      setLoading(true)

      const res: any = await fetchProductDatas() // Call the function

      if (res && res.length > 0) {
        setCylinders(res)
      }

      setLoading(false)
    }

    fetchDatas() // Call the async function inside useEffect
  }, [])

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      console.log(id)
      if (id) {
        setLoading(true)
        const res: any = await fetchProductById(id) // Call the function
        setCylinder(res)
        setLoading(false)
      }
    }

    fetchData() // Call the async function inside useEffect
  }, [id])

  if (loading) return <Spin size='large' style={{display: 'block', margin: '50px auto'}} />
  if (!cylinder) return <Text type='danger'>Product not found.</Text>

  // Fetch related products (e.g., same category or type)
  //   const relatedProducts = cylinders.filter((c) => c.type === cylinder.type && c.id !== cylinder.id)
  const relatedProducts: Product[] = cylinders.filter((c) => parseInt(c.id) < 5)

  return (
    <MainLayout>
      <Breadcrumb style={{padding: '10px 50px'}}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      {cylinder ? (
        <Row gutter={[32, 32]} style={{padding: '20px'}}>
          {/* Smaller Image Section */}
          <Col xs={24} sm={12} md={8}>
            <Badge.Ribbon
              text={cylinder.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
              color={cylinder.stock > 0 ? 'green' : 'red'}
            >
              <Image width='100%' src={cylinder.image} alt={cylinder.name} />
            </Badge.Ribbon>
          </Col>

          {/* Product Info Section */}
          <Col xs={24} sm={12} md={16}>
            <Card
              bordered={false}
              style={{boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', borderRadius: '10px'}}
            >
              <Title level={2}>{cylinder.name}</Title>
              <Text type='secondary' style={{fontSize: '16px'}}>
                Danh mục: {cylinder.typeId}
              </Text>

              {/* Price */}
              <Row align='middle' gutter={16}>
                <Col>
                  <Title level={3} style={{color: '#E53935', fontWeight: 'bold'}}>
                    $
                    {cylinder?.price?.toLocaleString('vi', {style: 'currency', currency: 'VND'}) ||
                      'LIÊN HỆ'}
                  </Title>
                </Col>
                <Col>
                  {cylinder.stock > 0 && (
                    <Tag color='green' style={{fontSize: '16px'}}>
                      Còn hàng
                    </Tag>
                  )}
                  {cylinder.stock === 0 && (
                    <Tag color='red' style={{fontSize: '16px'}}>
                      Hết hàng
                    </Tag>
                  )}
                </Col>
              </Row>

              {/* Description */}
              <Paragraph>{cylinder.description}</Paragraph>

              <Space style={{marginTop: '20px'}}>
                <Button
                  type='primary'
                  icon={<ShoppingCartOutlined />}
                  size='large'
                  disabled={cylinder.stock === 0}
                >
                  Mua ngay
                </Button>
                <Button type='default' size='large'>
                  Thêm vào giỏ hàng
                </Button>
              </Space>
            </Card>

            {/* Tabs for More Details */}
            <Tabs defaultActiveKey='1' style={{marginTop: '20px'}}>
              <TabPane tab='Thông tin sản phẩm' key='1'>
                <ul>
                  <li>
                    <strong>Danh mục:</strong> {cylinder.typeId}
                  </li>
                  <li>
                    <strong>Giá:</strong> $
                    {cylinder.price.toLocaleString('vi', {
                      style: 'currency',
                      currency: 'VND',
                    }) || 'LIÊN HỆ'}
                  </li>
                  <li>
                    <strong>Số lượng:</strong>{' '}
                    {cylinder.stock > 0 ? `${cylinder.stock} Available` : 'Out of Stock'}
                  </li>
                </ul>
              </TabPane>
              <TabPane tab='Đánh giá' key='2'>
                <Text>Chưa có đánh giá nào! Đánh giá ngay</Text>
              </TabPane>
            </Tabs>

            {/* Divider for More Options */}
            <Divider />
            <Space>
              <Button type='link' href='#help-center'>
                Bạn cần hỗ trợ? Gọi 001230012 để được trợ giúp
              </Button>
            </Space>
          </Col>

          {/* Related Products Section */}
          <Col xs={24} style={{marginTop: '40px'}}>
            <Title level={3}>Sản phẩm liên quan</Title>
            <Row gutter={[16, 16]}>
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct: any) => (
                  <Col key={relatedProduct.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard product={relatedProduct} />
                  </Col>
                ))
              ) : (
                <Text>No related products found.</Text>
              )}
            </Row>
          </Col>
        </Row>
      ) : (
        <>aaaaa</>
      )}
    </MainLayout>
  )
}

export default ProductDetail
