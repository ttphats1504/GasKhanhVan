import {
  Typography,
  Menu,
  Skeleton,
  Collapse,
  Checkbox,
  Slider,
  Space,
  Tag,
  Divider,
} from "antd";
import type { MenuProps, CheckboxProps } from "antd";
import {
  AppstoreOutlined,
  FireOutlined,
  DollarOutlined,
  TagsOutlined,
  ThunderboltOutlined,
  StarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import styles from "@/styles/common/FilterSideBar.module.scss";
import { useEffect, useState } from "react";
import handleAPI from "@/apis/handleAPI";
import { useRouter } from "next/router";
import Category from "@/models/Category";
import Brand from "@/models/Brand";

const { Title, Text } = Typography;
const { Panel } = Collapse;

export interface FilterOptions {
  priceRange?: [number, number];
  brands?: number[];
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

type FilterSideBarProps = {
  title: string;
  onFilterChange?: (filters: FilterOptions) => void;
};

type MenuItem = Required<MenuProps>["items"][number];

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) key[item.key] = level;
      if (item.children) func(item.children, level + 1);
    });
  };
  func(items1);
  return key;
};

const FilterSideBar = ({ title, onFilterChange }: FilterSideBarProps) => {
  const router = useRouter();
  const slug = router.query.slug;
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(
    undefined,
  );
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [navigating, setNavigating] = useState<boolean>(false);

  // Filter states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  // find parent key
  const findParentKey = (items: any[], slug: string): string | undefined => {
    for (const item of items) {
      if (item.children?.some((child: any) => child.key === slug))
        return item.key as string;
      if (item.children) {
        const found = findParentKey(item.children, slug);
        if (found) return found;
      }
    }
    return undefined;
  };

  useEffect(() => {
    if (!slug || !items.length) return;
    const lastSlug = slug[slug.length - 1];
    const parentKey = findParentKey(items, String(lastSlug));
    if (parentKey) setStateOpenKeys([parentKey]);
    else setStateOpenKeys([String(lastSlug)]);
    setSelectedSlug(String(lastSlug));
  }, [slug, items]);

  useEffect(() => {
    setSelectedSlug(router.query.slug as string | undefined);
  }, [router.query.slug]);

  const buildMenuItems = (categories: Category[]): MenuItem[] => {
    return categories
      .filter((cat) => cat.slug !== "tin-tuc")
      .map((cat: any) => ({
        key: cat.slug,
        label: cat.name,
        icon: <AppstoreOutlined />,
        children: cat.children?.map((subCat: any) => ({
          key: subCat.slug,
          label: subCat.name,
          icon: <FireOutlined />,
        })),
        onTitleClick: () => {
          router.push(`/${cat.slug}`);
        },
      }));
  };

  const levelKeys = getLevelKeys(items as LevelKeysProps[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, brandsRes]: any = await Promise.all([
          handleAPI("/api/categories", "get"),
          handleAPI("/api/brands", "get"),
        ]);

        const filtered = categoriesRes.filter(
          (cat: any) => cat.slug !== "san-pham",
        );
        const menuItems = buildMenuItems(filtered);
        setItems(menuItems);
        setBrands(brandsRes?.data || []);

        // Prefetch
        filtered.forEach((cat: any) => {
          router.prefetch(`/${cat.slug}`);
          cat.children?.forEach((subCat: any) =>
            router.prefetch(`/${subCat.slug}`),
          );
        });
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Notify parent when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filterOptions);
    }
  }, [filterOptions, onFilterChange]);

  const onClick: MenuProps["onClick"] = async (e) => {
    const findItem = (items: any[], key: string): any | undefined => {
      for (const item of items) {
        if (item.key === key) return item;
        if (item.children) {
          const found = findItem(item.children, key);
          if (found) return found;
        }
      }
      return undefined;
    };

    const clickedItem = findItem(items, e.key as string);
    if (clickedItem) {
      setNavigating(true);
      await router.push(`/${clickedItem.key}`);
      setNavigating(false);
    }

    const parentKey: any = items.find((item: any) =>
      item.children?.some((child: any) => child.key === e.key),
    )?.key;

    setStateOpenKeys((prev: any) => {
      const newKeys: any = new Set(prev);
      if (parentKey) newKeys.add(parentKey);
      newKeys.add(e.key);
      return [...newKeys];
    });
  };

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1,
    );
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      const currentLevelKey = levelKeys[currentOpenKey];

      const currentItem: any = items.filter(
        (item) => item?.key === currentOpenKey,
      );
      if (
        currentItem &&
        currentItem?.length > 0 &&
        currentItem[0].children.length > 0
      ) {
        openKeys.push(currentItem[0].children[0].key);
      }

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= currentLevelKey),
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  // Filter handlers
  const handlePriceChange = (value: number | number[]) => {
    const range = value as [number, number];
    setPriceRange(range);
    setFilterOptions((prev) => ({ ...prev, priceRange: range }));
  };

  const handleBrandChange = (brandId: number, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandId]
      : selectedBrands.filter((id) => id !== brandId);
    setSelectedBrands(newBrands);
    setFilterOptions((prev) => ({ ...prev, brands: newBrands }));
  };

  const handleStatusChange = (key: keyof FilterOptions, checked: boolean) => {
    setFilterOptions((prev) => ({ ...prev, [key]: checked }));
  };

  const formatPrice = (value?: number) => {
    if (value === undefined) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className={styles.filter_bar}>
      <Title
        level={4}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        {title}
      </Title>

      {loading || navigating ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          {/* Categories Menu */}
          <Menu
            mode="inline"
            selectedKeys={selectedSlug ? [selectedSlug] : []}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            onClick={onClick}
            items={items}
          />

          <Divider style={{ margin: "16px 0" }} />

          {/* Advanced Filters */}
          <Collapse
            defaultActiveKey={["price", "brands", "status"]}
            ghost
            className={styles.filter_collapse}
          >
            {/* Price Range Filter */}
            <Panel
              header={
                <Space>
                  <DollarOutlined style={{ color: "#fa8c16" }} />
                  <Text strong>Khoảng giá</Text>
                </Space>
              }
              key="price"
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="small"
              >
                <Slider
                  range
                  min={0}
                  max={5000000}
                  step={100000}
                  value={priceRange}
                  onChange={handlePriceChange}
                  tooltip={{ formatter: formatPrice }}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatPrice(priceRange[0])}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatPrice(priceRange[1])}
                  </Text>
                </div>
              </Space>
            </Panel>

            {/* Brands Filter */}
            {brands.length > 0 && (
              <Panel
                header={
                  <Space>
                    <TagsOutlined style={{ color: "#fa8c16" }} />
                    <Text strong>Thương hiệu</Text>
                  </Space>
                }
                key="brands"
              >
                <Space direction="vertical" size="small">
                  {brands.slice(0, 6).map((brand) => (
                    <Checkbox
                      key={brand.id}
                      checked={selectedBrands.includes(brand.id)}
                      onChange={(e) =>
                        handleBrandChange(brand.id, e.target.checked)
                      }
                    >
                      {brand.name}
                    </Checkbox>
                  ))}
                </Space>
              </Panel>
            )}

            {/* Status Filter */}
            <Panel
              header={
                <Space>
                  <StarOutlined style={{ color: "#fa8c16" }} />
                  <Text strong>Trạng thái</Text>
                </Space>
              }
              key="status"
            >
              <Space direction="vertical" size="small">
                <Checkbox
                  checked={filterOptions.featured}
                  onChange={(e) =>
                    handleStatusChange("featured", e.target.checked)
                  }
                >
                  <Space size={4}>
                    <ThunderboltOutlined style={{ color: "#ff4d4f" }} />
                    <Text>Khuyến mãi</Text>
                  </Space>
                </Checkbox>
                <Checkbox
                  checked={filterOptions.isNew}
                  onChange={(e) =>
                    handleStatusChange("isNew", e.target.checked)
                  }
                >
                  <Space size={4}>
                    <StarOutlined style={{ color: "#52c41a" }} />
                    <Text>Sản phẩm mới</Text>
                  </Space>
                </Checkbox>
                <Checkbox
                  checked={filterOptions.isBestSeller}
                  onChange={(e) =>
                    handleStatusChange("isBestSeller", e.target.checked)
                  }
                >
                  <Space size={4}>
                    <TrophyOutlined style={{ color: "#faad14" }} />
                    <Text>Bán chạy</Text>
                  </Space>
                </Checkbox>
              </Space>
            </Panel>
          </Collapse>
        </>
      )}
    </div>
  );
};

export default FilterSideBar;
