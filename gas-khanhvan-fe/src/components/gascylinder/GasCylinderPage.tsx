import {
  Carousel,
  Col,
  Empty,
  Flex,
  Image,
  Layout,
  Row,
  Typography,
  Skeleton,
  Button,
} from "antd";
import { FireOutlined } from "@ant-design/icons";
import styles from "@/styles/gascylinder/GasCylinderPage.module.scss";
import FilterSideBar from "../common/FilterSidebar";
import ProductCard from "../common/ProductCard";
import handleAPI from "@/apis/handleAPI";
import Product from "../../../../gkv-admin/src/models/Product";
import { useEffect, useState } from "react";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import BrandsCarousel from "../common/BrandsCarousel";
import ProductCardSkeleton from "../common/ProductCardSkeleton";

interface Props {
  cate: Category | undefined;
  selectedBrand?: number | null; // <- nhận từ ngoài
  isFeatured?: boolean; // <- hiển thị sản phẩm khuyến mãi
}

const { Title } = Typography;

const fetchCategoryById = async (categoryId: number) => {
  const api = `/api/categories/${categoryId}`;
  try {
    const res = await handleAPI(api, "get");
    return res;
  } catch (error) {
    console.error("Error fetching Products:", error);
    return [];
  }
};

const fetchBannerImages = async () => {
  const api = "/api/banners";
  try {
    const res = await handleAPI(api, "get");
    return res;
  } catch (error) {
    console.error("Error fetching Banners:", error);
    return [];
  }
};

const GasCylinderPage = ({
  cate,
  selectedBrand: selectedBrandProp,
  isFeatured,
}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>();
  const [banners, setBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(
    selectedBrandProp || null
  );

  // Cập nhật selectedBrand nếu prop thay đổi từ ngoài
  useEffect(() => {
    setSelectedBrand(selectedBrandProp || null);
  }, [selectedBrandProp]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res: any = await handleAPI("/api/brands", "get");
        setBrands(res?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    setProducts([]);
    setBanners([]);
    setCategory(null);

    const fetchData = async () => {
      setLoading(true);

      let typeIds: number[] = [];
      if (cate) {
        typeIds.push(cate.id);
        // Nếu category có children, lấy id của children
        if (cate.children && cate.children.length > 0) {
          typeIds.push(...cate.children.map((c) => c.id));
        }
      }

      let productApi = "/api/products?";

      // Nếu là trang khuyến mãi, chỉ lấy sản phẩm featured
      if (isFeatured) {
        productApi += `featured=true`;
      } else {
        if (selectedBrand) {
          productApi += `brandId=${selectedBrand}`;
          if (typeIds.length) productApi += `&typeId=${typeIds.join(",")}`;
        } else if (typeIds.length) {
          productApi += `typeId=${typeIds.join(",")}`;
        }
      }

      const [productRes, bannerRes, cateRes]: any = await Promise.all([
        handleAPI(productApi, "get"),
        fetchBannerImages(),
        cate ? fetchCategoryById(cate.id) : Promise.resolve(null),
      ]);

      if (productRes?.totalItems) setProducts(productRes.data);
      if (cateRes) setCategory(cateRes);

      // Filter banners by categoryId
      if (bannerRes?.length && cate) {
        const categoryBanners = bannerRes.filter(
          (b: any) => Number(b.categoryId) === Number(cate.id)
        );
        setBanners(categoryBanners.map((b: any) => b.image));
      } else {
        setBanners([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [cate?.id, selectedBrand, isFeatured]);

  const titleText = selectedBrand
    ? brands.find((b) => b.id === selectedBrand)?.name
    : category?.name;

  return (
    <div className={styles.wrapper}>
      {/* Header cho trang khuyến mãi */}
      {isFeatured && (
        <div className={styles.featured_header}>
          <div className={styles.icon_wrapper}>
            <FireOutlined className={styles.fire_icon} />
          </div>
          <div>
            <Title level={2} className={styles.featured_title}>
              SẢN PHẨM KHUYẾN MÃI
            </Title>
          </div>
        </div>
      )}

      {!isFeatured && (
        <>
          {loading ? (
            <Skeleton.Image
              active
              style={{ width: "100%", height: 300, marginBottom: 20 }}
            />
          ) : (
            banners.length > 0 && (
              <Carousel autoplay className={styles.carousel}>
                {banners.map((url, index) => (
                  <div key={index}>
                    <Image
                      src={url}
                      alt={`Banner ${index}`}
                      preview={false}
                      className={styles.carousel_image}
                    />
                  </div>
                ))}
              </Carousel>
            )
          )}

          {brands.length > 0 && (
            <BrandsCarousel
              brands={brands}
              onSelect={(brandId) => setSelectedBrand(brandId)}
              selectedBrand={selectedBrand}
            />
          )}
        </>
      )}

      <div>
        <Row gutter={32}>
          <Col xs={24} md={6}>
            <FilterSideBar title="Danh mục sản phẩm" />
          </Col>

          <Col xs={24} md={18}>
            <Flex vertical>
              {titleText && <Title level={3}>{titleText}</Title>}

              {loading ? (
                <ProductCardSkeleton
                  count={8}
                  columns={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }}
                />
              ) : (
                <Row gutter={[16, 16]}>
                  {products.length > 0 ? (
                    products.map((cylinder: any) => (
                      <Col
                        key={cylinder.id}
                        xs={12}
                        sm={12}
                        md={8}
                        lg={8}
                        xl={8}
                        xxl={6}
                      >
                        <ProductCard product={cylinder} />
                      </Col>
                    ))
                  ) : (
                    <Col xs={24}>
                      <Flex
                        vertical
                        align="center"
                        justify="center"
                        style={{
                          minHeight: 400,
                          background: "#fafafa",
                          borderRadius: 12,
                          padding: "40px 20px",
                        }}
                      >
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <Flex vertical gap={8} align="center">
                              <Typography.Title level={4} style={{ margin: 0 }}>
                                Chưa có sản phẩm nào
                              </Typography.Title>
                              <Typography.Text type="secondary">
                                Danh mục này hiện chưa có sản phẩm. Vui lòng
                                quay lại sau hoặc khám phá các danh mục khác.
                              </Typography.Text>
                            </Flex>
                          }
                        >
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => (window.location.href = "/")}
                            style={{ marginTop: 16 }}
                          >
                            Về trang chủ
                          </Button>
                        </Empty>
                      </Flex>
                    </Col>
                  )}
                </Row>
              )}
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GasCylinderPage;
