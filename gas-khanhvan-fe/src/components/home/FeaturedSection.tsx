import { Col, Flex, Grid, Row, Typography, Button } from "antd";
import Container from "../common/Container";
import styles from "../../styles/home/FeaturedSection.module.scss";
import ProductCard from "../common/ProductCard";
import handleAPI from "@/apis/handleAPI";
import { useEffect, useState } from "react";
import Product from "@/models/Product";
import {
  FireOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

// Countdown timer hook
const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
};

const fetchFeaturedProducts = async (limit = 6) => {
  let api = `/api/products?page=1&limit=${limit}&featured=true`;

  try {
    const res = await handleAPI(api, "get");
    return res;
  } catch (error) {
    console.error("Error fetching Featured Products:", error);
    return null;
  }
};

export default function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const screens = useBreakpoint();
  const [limit, setLimit] = useState(6);
  const timeLeft = useCountdown();
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    const res: any = await fetchFeaturedProducts(limit);
    if (res) {
      setProducts(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (screens.xs) setLimit(4);
    else if (screens.sm) setLimit(6);
    else if (screens.md) setLimit(8);
    else if (screens.lg) setLimit(10);
    else setLimit(12);
  }, [screens]);

  useEffect(() => {
    fetchData();
  }, [limit]);

  if (!loading && products.length <= 0) return <></>;

  return (
    <div className={styles.featured_wrapper}>
      <Container>
        <div className={styles.featured_header}>
          <Flex align="center" gap={12} className={styles.header_content}>
            <div className={styles.icon_wrapper}>
              <FireOutlined className={styles.fire_icon} />
            </div>
            <div>
              <Title level={2} className={styles.featured_title}>
                KHUYẾN MÃI HÔM NAY
              </Title>
              <Text className={styles.featured_subtitle}>
                <ThunderboltOutlined /> Giá sốc - Số lượng có hạn
              </Text>
            </div>
          </Flex>

          <div className={styles.timer_badge}>
            <ClockCircleOutlined className={styles.clock_icon} />
            <span className={styles.timer_text}>
              {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        <Row className={styles.card_wrap} gutter={[16, 16]}>
          {products.map((product: Product) => (
            <Col key={product.id} sm={12} xs={12} md={8} lg={4}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {/* View All Button */}
        <Flex justify="center" style={{ marginTop: 40 }}>
          <Button
            type="primary"
            size="large"
            className={styles.view_all_btn}
            icon={<ArrowRightOutlined />}
            onClick={() => router.push("/khuyen-mai")}
          >
            Xem tất cả sản phẩm khuyến mãi
          </Button>
        </Flex>
      </Container>
    </div>
  );
}
