import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
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
  Breadcrumb,
  Tag,
  Rate,
  Flex,
  Pagination,
  Skeleton,
  Empty,
} from "antd";
import { GiftOutlined, PhoneOutlined } from "@ant-design/icons";
import MainLayout from "@/layouts/MainLayout";
import ProductCard from "@/components/common/ProductCard";
import handleAPI from "@/apis/handleAPI";
import Product from "@/models/Product";
import formatCurrency from "@/utils/formatCurrency";
import styles from "@/styles/gascylinder/ProductDetailsPage.module.scss";
import { Modal } from "antd";
import { RobotOutlined, LoadingOutlined } from "@ant-design/icons";
import DOMPurify from "dompurify";
import ViewedProducts from "@/components/common/ViewedProducts";
import ProductCardSkeleton from "@/components/common/ProductCardSkeleton";

const { Title, Text, Paragraph } = Typography;

const fetchProductDatas = async () => {
  try {
    return await handleAPI("/api/products", "get");
  } catch (error) {
    console.error("Error fetching Products:", error);
    return [];
  }
};

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [outstandingProducts, setOutstandingProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [savePrice, setSavePrice] = useState(0);
  const [expand, setExpand] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [aiVisible, setAiVisible] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAI = async (question: string) => {
    if (!product) return;
    try {
      setAiLoading(true);
      setAiAnswer("");

      const response: any = await handleAPI(
        "/api/products/ask-ai",
        "post",
        {
          Id: product.id,
          question,
        },
        {
          "Content-Type": "application/json",
        }
      );
      const cleanHtml = DOMPurify.sanitize(response.html);
      const stripMarkdown = cleanHtml.replace(/```[html]*|```/g, "");
      setAiAnswer(stripMarkdown);
    } catch (err) {
      console.error("Ask AI error:", err);
      setAiAnswer(
        "Xin lỗi, AI hiện không phản hồi được. Vui lòng thử lại sau."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // 🔹 Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (slug) {
          const res: any = await handleAPI(`/api/products/slug/${slug}`, "get");
          setProduct(res);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Fetch list
  useEffect(() => {
    if (product) {
      fetchProductDatas().then((res: any) => {
        const relatedProducts: Product[] = res?.data
          .filter((c: any) => parseInt(c.typeId) == product?.typeId)
          .slice(0, 5);
        const outstandingProducts: Product[] = res?.data
          .filter((c: any) => c.id != product?.id)
          .slice(0, 5);
        setRelatedProducts(relatedProducts);
        setOutstandingProducts(outstandingProducts);
      });

      const saved: any = product.old_price - product.price;
      setSavePrice(saved);
    }
  }, [slug, product]);

  const updatePageSize = () => {
    if (window.innerWidth < 576) {
      setPageSize(2); // mobile
    } else if (window.innerWidth < 992) {
      setPageSize(3); // tablet
    } else {
      setPageSize(4); // desktop
    }
  };

  useEffect(() => {
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  useEffect(() => {
    if (!product) return;
    const stored = JSON.parse(
      localStorage.getItem("viewedProducts") || "[]"
    ) as Product[];
    const filtered = stored.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, 50);
    localStorage.setItem("viewedProducts", JSON.stringify(updated));
  }, [product]);

  const pagedRelatedProducts = relatedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <MainLayout>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item href="/san-pham">Sản phẩm</Breadcrumb.Item>
          <Breadcrumb.Item>...</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={18}>
            <Card>
              <Row gutter={24}>
                <Col xs={24} md={10}>
                  <Skeleton.Image
                    active
                    style={{ width: "100%", height: 300 }}
                  />
                </Col>
                <Col xs={24} md={14}>
                  <Skeleton active paragraph={{ rows: 8 }} />
                </Col>
              </Row>
            </Card>
            <Card style={{ marginTop: 20 }}>
              <Skeleton active paragraph={{ rows: 10 }} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Skeleton active paragraph={{ rows: 5 }} />
            </Card>
          </Col>
        </Row>
        <ProductCardSkeleton count={4} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item href="/san-pham">Sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>{product?.name}</Breadcrumb.Item>
      </Breadcrumb>

      {product ? (
        <Row gutter={[32, 32]}>
          <Col xs={24} md={18}>
            <Row gutter={[24, 24]}>
              {/* Main product card */}
              <Col xs={24}>
                <Card bordered={false} style={{ borderRadius: "10px" }}>
                  <Row gutter={24} align="top">
                    {/* Image */}
                    <Col xs={24} md={10}>
                      <Badge.Ribbon
                        text={product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                        color={product.stock > 0 ? "green" : "red"}
                      >
                        <Image
                          width="100%"
                          src={product.image}
                          alt={product.name}
                          style={{
                            borderRadius: "3px",
                            padding: "4px",
                            objectFit: "cover",
                          }}
                        />
                      </Badge.Ribbon>
                    </Col>

                    {/* Info */}
                    <Col xs={24} md={14}>
                      <Title level={3}>{product.name}</Title>
                      {/* <Button
                        type='primary'
                        shape='round'
                        icon={aiLoading ? <LoadingOutlined spin /> : <RobotOutlined />}
                        onClick={() => {
                          setAiVisible(true)
                          handleAskAI(
                            'Bạn có thể tư vấn về sản phẩm này không? và cho tôi xin review của những người khác khi dùng sản phẩm này, có dẫn link cụ thể thì càng tốt'
                          )
                        }}
                        disabled={aiLoading}
                        style={{
                          background: 'linear-gradient(90deg,#36d1dc,#5b86e5)',
                          border: 'none',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {aiLoading ? 'Đang tư vấn...' : 'AI tư vấn'}
                      </Button> */}

                      <Flex gap="middle" align="center">
                        <Rate
                          allowHalf
                          disabled
                          defaultValue={4.5}
                          style={{ fontSize: "16px" }}
                        />
                        <Text type="secondary">
                          10 lượt đánh giá (<a>Xem Ngay</a>)
                        </Text>
                      </Flex>

                      {/* Price */}
                      <Title
                        level={3}
                        style={{
                          color: "#E53935",
                          fontWeight: "bold",
                          marginBottom: 0,
                        }}
                      >
                        {product?.price
                          ? formatCurrency(product.price)
                          : "LIÊN HỆ"}{" "}
                        <Text style={{ fontSize: 14 }}>(Đã bao gồm VAT)</Text>
                      </Title>
                      <Text delete type="secondary">
                        Giá Thị Trường:{" "}
                        {product.old_price > 0
                          ? formatCurrency(product.old_price)
                          : formatCurrency(product.price)}
                      </Text>
                      <br />
                      {savePrice > 0 ? (
                        <Tag color="red">
                          Tiết Kiệm {formatCurrency(savePrice)}
                        </Tag>
                      ) : (
                        <Tag color="green">Giá tốt</Tag>
                      )}

                      {/* CTA Buttons */}
                      <Row gutter={[16, 16]} style={{ margin: "14px 0px" }}>
                        {/* Chat Zalo */}
                        <Col xs={24} sm={12} style={{ paddingLeft: 0 }}>
                          <Button
                            type="primary"
                            size="large"
                            block
                            icon={
                              <Image
                                src="/assets/zalo.png"
                                width={24}
                                height={24}
                                alt="zalo"
                                preview={false}
                              />
                            }
                            style={{ height: "auto", padding: "12px" }}
                            onClick={() =>
                              window.open(
                                "https://zalo.me/0937762979",
                                "_blank"
                              )
                            }
                          >
                            <Flex vertical align="center" gap={4}>
                              <Flex align="center" gap={8}>
                                <span>Liên hệ qua Zalo</span>
                              </Flex>
                              <Text style={{ fontSize: 12, color: "#fff" }}>
                                (Giải Pháp Hỗ Trợ Tức Thì)
                              </Text>
                            </Flex>
                          </Button>
                        </Col>
                        {/* Gọi ngay */}
                        <Col xs={24} sm={12}>
                          <Button
                            type="default"
                            danger
                            size="large"
                            block
                            style={{ height: "auto", padding: "12px" }}
                            onClick={() =>
                              (window.location.href = "tel:02837731612")
                            }
                          >
                            <Flex vertical align="center" gap={4}>
                              <Flex align="center" gap={8}>
                                <PhoneOutlined />
                                <span>Gọi Đặt Ngay</span>
                              </Flex>
                              <Text style={{ fontSize: 14, color: "#000" }}>
                                (028 3773 1612)
                              </Text>
                            </Flex>
                          </Button>
                        </Col>
                      </Row>
                      {/* ƯU ĐÃI THÊM */}
                      {product?.description && (
                        <Card
                          bordered
                          style={{
                            borderColor: "#f5222d",
                            borderRadius: 12,
                            background: "#fffbe6",
                          }}
                        >
                          <Space align="center" style={{ marginBottom: 12 }}>
                            <GiftOutlined
                              style={{ fontSize: 20, color: "#faad14" }}
                            />
                            <Title
                              level={4}
                              style={{ margin: 0, color: "#d4380d" }}
                            >
                              ƯU ĐÃI THÊM
                            </Title>
                          </Space>

                          <div
                            dangerouslySetInnerHTML={{
                              __html: product.description,
                            }}
                            style={{ lineHeight: 1.6 }}
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
                    defaultActiveKey="1"
                    style={{ marginTop: 20 }}
                    items={[
                      {
                        key: "1",
                        label: "Thông tin sản phẩm",
                        children: (
                          <>
                            {isMobile ? (
                              <>
                                <div
                                  style={{
                                    maxHeight: expand ? "none" : 300,
                                    overflow: "hidden",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: product.description2,
                                  }}
                                  className={styles.description2}
                                />
                                <Button
                                  type="link"
                                  onClick={() => setExpand(!expand)}
                                >
                                  {expand ? "Thu gọn" : "Xem thêm"}
                                </Button>
                              </>
                            ) : (
                              <>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: product.description2,
                                  }}
                                  className={styles.description2}
                                />
                              </>
                            )}
                          </>
                        ),
                      },
                      {
                        key: "2",
                        label: "Đánh giá",
                        children: (
                          <Text>Chưa có đánh giá nào! Đánh giá ngay.</Text>
                        ),
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
                  borderRadius: "10px",
                  background: "#fafafa",
                }}
              >
                <Title level={4} style={{ color: "#f66b34" }}>
                  Chính sách Gas Khánh Vân
                </Title>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Space direction="vertical">
                      <Title level={5}>🚚 Giao hàng nhanh</Title>
                      <Text>Miễn phí giao hàng trong bán kính 5km.</Text>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical">
                      <Title level={5}>🛡️ Bảo hành chính hãng</Title>
                      <Text>Sản phẩm chính hãng, bảo hành đầy đủ.</Text>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical">
                      <Title level={5}>📞 Hỗ trợ 24/7</Title>
                      <Text>Hotline: 001230012 luôn sẵn sàng hỗ trợ bạn.</Text>
                    </Space>
                  </Col>
                </Row>
              </Card>
              <Card
                bordered={false}
                style={{
                  borderRadius: "10px",
                  background: "#fafafa",
                }}
              >
                <Title level={4} style={{ color: "#f66b34" }}>
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
          <Col xs={24} style={{ marginTop: 40 }}>
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
              <Row justify="center" style={{ marginTop: 20 }}>
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
          <Col xs={24} style={{ marginTop: 40 }}>
            <ViewedProducts excludeProductId={parseInt(product?.id)} />
          </Col>
        </Row>
      ) : (
        <Flex
          vertical
          align="center"
          justify="center"
          style={{
            minHeight: 500,
            background: "#fafafa",
            borderRadius: 12,
            padding: "60px 20px",
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Flex vertical gap={8} align="center">
                <Typography.Title level={3} style={{ margin: 0 }}>
                  Không tìm thấy sản phẩm
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 16 }}>
                  Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </Typography.Text>
              </Flex>
            }
          >
            <Space size="middle" style={{ marginTop: 24 }}>
              <Button
                type="primary"
                size="large"
                onClick={() => router.push("/")}
              >
                Về trang chủ
              </Button>
              <Button size="large" onClick={() => router.back()}>
                Quay lại
              </Button>
            </Space>
          </Empty>
        </Flex>
      )}
      <Modal
        title={
          <Flex align="center" gap={8}>
            <RobotOutlined style={{ color: "#764ba2" }} />
            <span>AI Tư Vấn Sản Phẩm</span>
          </Flex>
        }
        open={aiVisible}
        onCancel={() => setAiVisible(false)}
        footer={null}
        centered
      >
        {aiLoading ? (
          <Flex align="center" justify="center" style={{ minHeight: 120 }}>
            <LoadingOutlined style={{ fontSize: 28, color: "#764ba2" }} spin />
          </Flex>
        ) : (
          <Card
            bordered={false}
            style={{
              background: "#fafafa",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            {aiAnswer ? (
              <div
                className={styles.ai_answer}
                dangerouslySetInnerHTML={{ __html: aiAnswer }}
              />
            ) : (
              <Paragraph type="secondary">AI chưa có câu trả lời.</Paragraph>
            )}
          </Card>
        )}
      </Modal>
    </MainLayout>
  );
};

export default ProductDetail;
