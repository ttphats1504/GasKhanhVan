import handleAPI from "@/apis/handleAPI";
import CustomBreadcrumbs, {
  CustomBreadcrumbItem,
} from "@/components/common/CustomBreadcrumbs";
import GasCylinderPage from "@/components/gascylinder/GasCylinderPage";
import CategoryLayout from "@/layouts/CategoryLayout";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Skeleton } from "antd";
import ViewedProducts from "@/components/common/ViewedProducts";
import ProductCardSkeleton from "@/components/common/ProductCardSkeleton";

export const fetchCategoryBySlug = async (slug: string) => {
  try {
    const res: any = await handleAPI(`/api/categories/slug/${slug}`, "get");
    return res;
  } catch (err) {
    console.error("Failed to fetch category:", err);
    return null;
  }
};

export const fetchBrandBySlug = async (slug: string) => {
  try {
    const res: any = await handleAPI(`/api/brands/slug/${slug}`, "get");
    return res;
  } catch (err) {
    console.error("Failed to fetch brand:", err);
    return null;
  }
};

export default function CategoryPagePage() {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<CustomBreadcrumbItem[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      let slugParam = router.query.slug;
      if (!slugParam) return;

      const slugArray = Array.isArray(slugParam) ? slugParam : [slugParam];
      const lastSlug = slugArray[slugArray.length - 1];

      // Thử tìm category trước
      const cat = await fetchCategoryBySlug(lastSlug);
      if (cat) {
        setCategory(cat);
      } else {
        const b = await fetchBrandBySlug(lastSlug);
        if (b) setBrand(b);
      }

      // Tạo breadcrumbs
      const breadcrumbItems: CustomBreadcrumbItem[] = await Promise.all(
        slugArray.map(async (s, i) => {
          const catItem = await fetchCategoryBySlug(s);
          const brandItem = !catItem ? await fetchBrandBySlug(s) : null;
          return {
            label:
              catItem?.name ||
              brandItem?.name ||
              decodeURIComponent(s.replace(/-/g, " ")),
            href: "/" + slugArray.slice(0, i + 1).join("/"),
          };
        })
      );

      setBreadcrumbs([{ label: "Trang chủ", href: "/" }, ...breadcrumbItems]);
      setLoading(false);
    };

    loadData();
  }, [router.query.slug]);

  if (loading) {
    return (
      <CategoryLayout>
        <Skeleton.Input active style={{ width: 300, marginBottom: 20 }} />
        <Skeleton.Image
          active
          style={{ width: "100%", height: 300, marginBottom: 20 }}
        />
        <ProductCardSkeleton count={12} />
      </CategoryLayout>
    );
  }

  // Hiển thị GasCylinderPage với category nếu có, hoặc chỉ brand nếu không có category
  return (
    <CategoryLayout>
      <CustomBreadcrumbs items={breadcrumbs} style={{ margin: "20px 0" }} />
      <GasCylinderPage
        cate={category || undefined}
        selectedBrand={brand?.id || null}
      />
      <Col xs={24} style={{ marginTop: 40 }}>
        <ViewedProducts />
      </Col>
    </CategoryLayout>
  );
}
