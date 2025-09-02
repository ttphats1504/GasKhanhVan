import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Image,
  Tabs,
  Badge,
  Space,
  Divider,
  Breadcrumb,
  Spin,
  Tag,
  Rate,
  Flex,
  List,
} from 'antd'
import {
  CheckCircleOutlined,
  GiftOutlined,
  MessageOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import MainLayout from '@/layouts/MainLayout'
import ProductCard from '@/components/common/ProductCard'
import handleAPI from '@/apis/handleAPI'
import Product from '@/models/Product'

const {Title, Text, Paragraph} = Typography

const fetchProductDatas = async () => {
  try {
    return await handleAPI('/api/products', 'get')
  } catch (error) {
    console.error('Error fetching Products:', error)
    return []
  }
}

const ProductDetail: React.FC = () => {
  const router = useRouter()
  const {slug} = router.query
  const [cylinders, setCylinders] = useState<Product[]>([])
  const [product, setProduct] = useState<Product>()
  const [loading, setLoading] = useState(true)

  // Fetch list
  useEffect(() => {
    fetchProductDatas().then((res: any) => {
      if (res?.length) setCylinders(res)
    })
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res: any = await handleAPI(`/api/products/slug/${slug}`, 'get')
        setProduct(res)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <MainLayout>
        <Row justify='center' align='middle' style={{minHeight: '50vh'}}>
          <Spin size='large' />
        </Row>
      </MainLayout>
    )
  }

  // Related products
  const relatedProducts: Product[] = cylinders.filter((c) => parseInt(c.id) < 5)
  if (!product) return <div>Không tìm thấy sản phẩm</div>
  return (
    <MainLayout>
      <Breadcrumb style={{margin: '16px 0'}}>
        <Breadcrumb.Item href='/'>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item href='/san-pham'>Sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>{product?.name}</Breadcrumb.Item>
      </Breadcrumb>

      {product ? (
        <Row gutter={[32, 32]}>
          <Col xs={24} md={16}>
            <Row gutter={[24, 24]}>
              {/* Main product card */}
              <Col xs={24}>
                <Card bordered={false} style={{borderRadius: '10px'}}>
                  <Row gutter={24} align='top'>
                    {/* Image */}
                    <Col xs={24} md={10}>
                      <Badge.Ribbon
                        text={product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                        color={product.stock > 0 ? 'green' : 'red'}
                      >
                        <Image
                          width='100%'
                          src={product.image}
                          alt={product.name}
                          style={{
                            border: '5px solid #fabc3f',
                            borderRadius: '3px',
                            padding: '4px',
                            objectFit: 'cover',
                          }}
                        />
                      </Badge.Ribbon>
                    </Col>

                    {/* Info */}
                    <Col xs={24} md={14}>
                      <Title level={3}>{product.name}</Title>
                      <Flex gap='middle' align='center'>
                        <Rate allowHalf disabled defaultValue={4.5} style={{fontSize: '16px'}} />
                        <Text type='secondary'>
                          10 lượt đánh giá (<a>Xem Ngay</a>)
                        </Text>
                      </Flex>

                      {/* Price */}
                      <Title
                        level={3}
                        style={{color: '#E53935', fontWeight: 'bold', marginBottom: 0}}
                      >
                        {product?.price
                          ? product.price.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })
                          : 'LIÊN HỆ'}{' '}
                        <Text style={{fontSize: 14}}>(Đã bao gồm VAT)</Text>
                      </Title>
                      <Text delete type='secondary'>
                        Giá Thị Trường: 515.000 đ
                      </Text>
                      <br />
                      <Tag color='red'>Tiết Kiệm 60.000 đ</Tag>

                      {/* CTA Buttons */}
                      <Row gutter={[16, 16]} style={{margin: '14px 0px'}}>
                        {/* Chat Zalo */}
                        <Col xs={24} sm={12} style={{paddingLeft: 0}}>
                          <Button
                            type='primary'
                            size='large'
                            block
                            icon={<MessageOutlined />}
                            style={{height: 'auto', padding: '12px'}}
                          >
                            <Flex vertical align='center' gap={4}>
                              <Flex align='center' gap={8}>
                                <ShoppingCartOutlined />
                                <span>Thêm vào giỏ</span>
                              </Flex>
                              <Text style={{fontSize: 12, color: '#fff'}}>
                                (Giải Pháp Hỗ Trợ Tức Thì)
                              </Text>
                            </Flex>
                          </Button>
                        </Col>
                        {/* Gọi ngay */}
                        <Col xs={24} sm={12}>
                          <Button
                            type='default'
                            danger
                            size='large'
                            block
                            style={{height: 'auto', padding: '12px'}}
                          >
                            <Flex vertical align='center' gap={4}>
                              <Flex align='center' gap={8}>
                                <PhoneOutlined />
                                <span>Gọi Đặt Ngay</span>
                              </Flex>
                              <Text style={{fontSize: 14, color: '#000'}}>(0839 160 160)</Text>
                            </Flex>
                          </Button>
                        </Col>
                      </Row>
                      {/* ƯU ĐÃI THÊM */}
                      {product?.description && (
                        <Card
                          bordered
                          style={{
                            borderColor: '#f5222d',
                            borderRadius: 12,
                            background: '#fffbe6',
                          }}
                        >
                          <Space align='center' style={{marginBottom: 12}}>
                            <GiftOutlined style={{fontSize: 20, color: '#faad14'}} />
                            <Title level={4} style={{margin: 0, color: '#d4380d'}}>
                              ƯU ĐÃI THÊM
                            </Title>
                          </Space>

                          <div
                            dangerouslySetInnerHTML={{__html: product.description}}
                            style={{lineHeight: 1.6}}
                          />
                        </Card>
                      )}
                    </Col>
                  </Row>
                </Card>
              </Col>
              {/* Tabs */}
              <Col xs={24}>
                <Card>
                  <Tabs
                    defaultActiveKey='1'
                    style={{marginTop: 20}}
                    items={[
                      {
                        key: '1',
                        label: 'Thông tin sản phẩm',
                        children: (
                          <ul>
                            <li>
                              <strong>Danh mục:</strong> {product.typeId}
                            </li>
                            <li>
                              <strong>Giá:</strong>{' '}
                              {product?.price
                                ? product.price.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                  })
                                : 'LIÊN HỆ'}
                            </li>
                            <li>
                              <strong>Số lượng:</strong>{' '}
                              {product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng'}
                            </li>
                          </ul>
                        ),
                      },
                      {
                        key: '2',
                        label: 'Đánh giá',
                        children: <Text>Chưa có đánh giá nào! Đánh giá ngay.</Text>,
                      },
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Policy card */}
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: '10px',
                padding: '20px',
                background: '#fafafa',
                height: '100%',
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Space direction='vertical'>
                    <Title level={5}>🚚 Giao hàng nhanh</Title>
                    <Text>Miễn phí giao hàng trong bán kính 5km.</Text>
                  </Space>
                </Col>
                <Col span={24}>
                  <Space direction='vertical'>
                    <Title level={5}>🛡️ Bảo hành chính hãng</Title>
                    <Text>Sản phẩm chính hãng, bảo hành đầy đủ.</Text>
                  </Space>
                </Col>
                <Col span={24}>
                  <Space direction='vertical'>
                    <Title level={5}>📞 Hỗ trợ 24/7</Title>
                    <Text>Hotline: 001230012 luôn sẵn sàng hỗ trợ bạn.</Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Related Products */}
          <Col xs={24} style={{marginTop: 40}}>
            <Title level={3}>Sản phẩm liên quan</Title>
            <Row gutter={[16, 16]}>
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct: Product) => (
                  <Col key={relatedProduct.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard product={relatedProduct} />
                  </Col>
                ))
              ) : (
                <Text>Không tìm thấy sản phẩm liên quan.</Text>
              )}
            </Row>
          </Col>
        </Row>
      ) : (
        <Text>Không tìm thấy sản phẩm.</Text>
      )}
    </MainLayout>
  )
}

export default ProductDetail
