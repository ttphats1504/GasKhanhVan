import { Col, Flex, Grid, Pagination, Row, Typography, Spin } from "antd";
import Container from "../common/Container";
import styles from "../../styles/home/ProductSection.module.scss";
import ProductCard from "../common/ProductCard";
import handleAPI from "@/apis/handleAPI";
import { useEffect, useState } from "react";
import Product from "@/models/Product";

const { useBreakpoint } = Grid;
const { Title } = Typography;

type ProductSectionProps = {
  title: string;
  categoryId?: number;
  brandId?: number;
  isFeatured?: boolean;
};

const fetchProductDatas = async (
  page = 1,
  limit = 6,
  categoryId?: number,
  brandId?: number,
  isFeatured?: boolean
) => {
  let api = `/api/products?page=${page}&limit=${limit}`;
  if (categoryId) api += `&typeId=${categoryId}`;
  if (brandId) api += `&brandId=${brandId}`;
  if (isFeatured) api += `&featured=true`;

  try {
    const res = await handleAPI(api, "get");
    return res;
  } catch (error) {
    console.error("Error fetching Products:", error);
    return null;
  }
};

export default function ProductSection({
  title,
  categoryId,
  brandId,
  isFeatured,
}: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const screens = useBreakpoint();
  const [limit, setLimit] = useState(6);

  const fetchData = async (page: number) => {
    setLoading(true);
    const res: any = await fetchProductDatas(
      page,
      limit,
      categoryId,
      brandId,
      isFeatured
    );
    if (res) {
      setProducts(res.data);
      setTotalItems(res.totalItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (screens.xs) setLimit(2);
    else if (screens.sm) setLimit(4);
    else if (screens.md) setLimit(6);
    else if (screens.lg) setLimit(8);
    else setLimit(12);
  }, [screens]);

  useEffect(() => {
    fetchData(page);
  }, [page, limit, categoryId, brandId, isFeatured]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!loading && products.length <= 0) return <></>;

  return (
    <div className={styles.section_wrapper}>
      <Container>
        <Flex vertical>
          <Title level={3} className={styles.product_title}>
            {title}
          </Title>
        </Flex>

        <Row className={styles.card_wrap} gutter={[16, 16]}>
          {products.map((product: Product) => (
            <Col key={product.id} sm={12} xs={12} md={8} lg={4}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {totalItems > limit && (
          <Flex
            justify="center"
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          >
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
    </div>
  );
}
