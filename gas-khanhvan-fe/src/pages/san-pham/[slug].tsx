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
  Pagination,
} from 'antd'
import {GiftOutlined, MessageOutlined, PhoneOutlined} from '@ant-design/icons'
import MainLayout from '@/layouts/MainLayout'
import ProductCard from '@/components/common/ProductCard'
import handleAPI from '@/apis/handleAPI'
import Product from '@/models/Product'
import formatCurrency from '@/utils/formatCurrency'
import styles from '@/styles/gascylinder/ProductDetailsPage.module.scss'

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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [outstandingProducts, setOutstandingProducts] = useState<Product[]>([])
  const [product, setProduct] = useState<Product>()
  const [loading, setLoading] = useState(true)
  const [savePrice, setSavePrice] = useState(0)
  const [expand, setExpand] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  // 🔹 Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (slug) {
          const res: any = await handleAPI(`/api/products/slug/${slug}`, 'get')
          setProduct(res)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  // Fetch list
  useEffect(() => {
    if (product) {
      fetchProductDatas().then((res: any) => {
        const relatedProducts: Product[] = res?.data
          .filter((c: any) => parseInt(c.typeId) == product?.typeId)
          .slice(0, 5)
        const outstandingProducts: Product[] = res?.data
          .filter((c: any) => c.id != product?.id)
          .slice(0, 5)
        setRelatedProducts(relatedProducts)
        setOutstandingProducts(outstandingProducts)
      })

      const saved: any = product.old_price - product.price
      setSavePrice(saved)
    }
  }, [slug, product])

  const updatePageSize = () => {
    if (window.innerWidth < 576) {
      setPageSize(2) // mobile
    } else if (window.innerWidth < 992) {
      setPageSize(3) // tablet
    } else {
      setPageSize(4) // desktop
    }
  }

  useEffect(() => {
    updatePageSize()
    window.addEventListener('resize', updatePageSize)
    return () => window.removeEventListener('resize', updatePageSize)
  }, [])

  const pagedRelatedProducts = relatedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  if (loading) {
    return (
      <MainLayout>
        <Row justify='center' align='middle' style={{minHeight: '50vh'}}>
          <Spin size='large' />
        </Row>
      </MainLayout>
    )
  }
  return (
    <MainLayout>
      <Breadcrumb style={{margin: '16px 0'}}>
        <Breadcrumb.Item href='/'>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item href='/san-pham'>Sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>{product?.name}</Breadcrumb.Item>
      </Breadcrumb>

      {product ? (
        <Row gutter={[32, 32]}>
          <Col xs={24} md={18}>
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
                        {product?.price ? formatCurrency(product.price) : 'LIÊN HỆ'}{' '}
                        <Text style={{fontSize: 14}}>(Đã bao gồm VAT)</Text>
                      </Title>
                      <Text delete type='secondary'>
                        Giá Thị Trường:{' '}
                        {product.old_price > 0
                          ? formatCurrency(product.old_price)
                          : formatCurrency(product.price)}
                      </Text>
                      <br />
                      {savePrice > 0 ? (
                        <Tag color='red'>Tiết Kiệm {formatCurrency(savePrice)}</Tag>
                      ) : (
                        <Tag color='green'>Giá tốt</Tag>
                      )}

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
                                <span>Liên hệ qua Zalo</span>
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
                          <>
                            {isMobile ? (
                              <>
                                <div
                                  style={{
                                    maxHeight: expand ? 'none' : 300,
                                    overflow: 'hidden',
                                  }}
                                  dangerouslySetInnerHTML={{__html: product.description2}}
                                  className={styles.description2}
                                />
                                <Button type='link' onClick={() => setExpand(!expand)}>
                                  {expand ? 'Thu gọn' : 'Xem thêm'}
                                </Button>
                              </>
                            ) : (
                              <>
                                <div
                                  dangerouslySetInnerHTML={{__html: product.description2}}
                                  className={styles.description2}
                                />
                              </>
                            )}
                          </>
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
          <Col xs={24} md={6}>
            <Flex vertical gap={16}>
              <Card
                bordered={false}
                style={{
                  borderRadius: '10px',
                  background: '#fafafa',
                }}
              >
                <Title level={4} style={{color: '#f66b34'}}>
                  Chính sách Gas Khánh Vân
                </Title>
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
              <Card
                bordered={false}
                style={{
                  borderRadius: '10px',
                  background: '#fafafa',
                }}
              >
                <Title level={4} style={{color: '#f66b34'}}>
                  Sản phẩm nổi bật
                </Title>
                <Row gutter={[16, 16]}>
                  {outstandingProducts.length > 0 ? (
                    outstandingProducts.map((prod: Product) => (
                      <Col key={prod.id} xs={24}>
                        <ProductCard product={prod} />
                      </Col>
                    ))
                  ) : (
                    <Text>Không tìm thấy sản phẩm liên quan.</Text>
                  )}
                </Row>
              </Card>
            </Flex>
          </Col>

          {/* Related Products */}
          <Col xs={24} style={{marginTop: 40}}>
            <Title level={3}>Sản phẩm liên quan</Title>
            <Row gutter={[16, 16]}>
              {pagedRelatedProducts.length > 0 ? (
                pagedRelatedProducts.map((relatedProduct: Product) => (
                  <Col key={relatedProduct.id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard product={relatedProduct} />
                  </Col>
                ))
              ) : (
                <Text>Không tìm thấy sản phẩm liên quan.</Text>
              )}
            </Row>

            {/* Pagination */}
            {relatedProducts.length > pageSize && (
              <Row justify='center' style={{marginTop: 20}}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={relatedProducts.length}
                  onChange={(page) => setCurrentPage(page)}
                  responsive
                />
              </Row>
            )}
          </Col>
        </Row>
      ) : (
        <Text>Không tìm thấy sản phẩm.</Text>
      )}
    </MainLayout>
  )
}

export default ProductDetail
