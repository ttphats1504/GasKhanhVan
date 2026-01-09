import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Menu,
  AutoComplete,
  Input,
  Image,
  Typography,
  Drawer,
  Button,
  Flex,
  Badge,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuOutlined,
  CloseOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AudioOutlined,
  CameraOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import Link from "next/link";
import handleAPI from "@/apis/handleAPI";
import styles from "../../styles/common/SearchHeader.module.scss";
import formatCurrency from "@/utils/formatCurrency";
import Category from "@/models/Category";
import Product from "@/models/Product";

const { Text } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

const SearchHeader = () => {
  const router = useRouter();
  const [current, setCurrent] = useState<string>("category");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 🔹 Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🔹 Khi click gợi ý
  const handleSuggestionClick = (keyword: string) => {
    handleSearch(keyword); // gọi lại search API
  };

  useEffect(() => {
    if (drawerOpen) {
      const groupKeys: string[] = [];
      const collectKeys = (items: any[]) => {
        items.forEach((item) => {
          if (item.children && item.key) {
            groupKeys.push(item.key as string);
            collectKeys(item.children);
          }
        });
      };
      collectKeys(items);
      setOpenKeys(groupKeys);
    }
  }, [drawerOpen, items]);

  // 🔹 Find parent key for child navigation
  const findParentKey = (items: any[], slug: string): string | undefined => {
    for (const item of items) {
      if (item.children?.some((child: any) => child.key === slug)) {
        return item.key as string;
      }
      if (item.children) {
        const found = findParentKey(item.children, slug);
        if (found) return found;
      }
    }
    return undefined;
  };

  const normalizeKey = (key: string) => {
    return key.replace(/^group-/, "").replace(/^cat-/, "");
  };

  const onClick: MenuProps["onClick"] = (e) => {
    let path = "";
    if (items.length > 0 && e.key) {
      const parentKey = findParentKey(items, e.key);
      if (parentKey) {
        path = `/${normalizeKey(parentKey)}/${normalizeKey(e.key)}`;
      } else {
        path = `/${normalizeKey(e.key)}`;
      }
    }
    router.push(path);
    setCurrent(e.key);
    setDrawerOpen(false); // đóng drawer khi chọn
  };

  // 🔹 Build menu items
  const buildMenuItems = (categories: Category[]): MenuItem[] => {
    const groupedCategoryMenu: MenuItem = {
      label: "Danh mục sản phẩm",
      key: "grouped-category",
      icon: <MenuUnfoldOutlined />,
      children: categories
        .filter((cat) => cat.slug !== "tin-tuc")
        .map((cat) => ({
          key: `group-${cat.slug}`,
          label: cat.name,
          children: cat.children?.map((subCat) => ({
            key: `group-${subCat.slug}`,
            label: subCat.name,
          })),
          onTitleClick: () => {
            router.push(`/${cat.slug}`);
            setDrawerOpen(false);
          },
        })),
    };

    const individualCategoryItems: MenuItem[] = categories.map((cat) => ({
      key: `cat-${cat.slug}`,
      label: cat.name,
      onClick: () => {
        if (cat.slug === "blog") {
          router.push("/tin-tuc");
        } else {
          router.push(`/${cat.slug}`);
        }
        setDrawerOpen(false);
      },
    }));

    return [groupedCategoryMenu, ...individualCategoryItems];
  };

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await handleAPI("/api/categories", "get");
        const filtered = res.filter((cat: any) => cat.slug !== "san-pham");
        const menuItems = buildMenuItems(filtered);
        setItems(menuItems);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Sync menu highlight with URL
  useEffect(() => {
    if (!router.isReady) return;
    const pathSlug = router.asPath.split("/")[1] || "category";
    setCurrent(pathSlug);
  }, [router.asPath, router.isReady]);

  // 🔹 Search suggestions
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const res: any = await handleAPI(`/api/products?search=${value}`, "get");
      const products: Product[] = res.data || [];
      setOptions(
        products.map((p) => ({
          value: p.slug,
          label: (
            <Link href={`/san-pham/${p.slug}`} className={styles.suggest_item}>
              <Image
                src={p.image}
                alt={p.name}
                className={styles.suggest_img}
                preview={false}
              />
              <div>
                <div className={styles.suggest_name}>{p.name}</div>
                <div className={styles.suggest_price}>
                  {formatCurrency(p.price)}
                </div>
                <Text delete type="secondary" style={{ fontSize: 13 }}>
                  {p.old_price > 0
                    ? formatCurrency(p.old_price)
                    : formatCurrency(p.price)}
                </Text>
              </div>
            </Link>
          ),
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (slug: string) => {
    router.push(`/san-pham/${slug}`);
    setDrawerOpen(false);
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

  // 🔹 Detect scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Header Wrapper */}
      <div
        className={`${styles.sticky_wrapper} ${
          isScrolled ? styles.scrolled : ""
        }`}
      >
        {isMobile && (
          <div className={styles.logo_mobile}>
            <Image
              src="/assets/logo.png"
              alt="Gas quan 7"
              width={60}
              height={60}
              preview={false}
            />
          </div>
        )}
        <div
          className={
            isMobile
              ? `${styles.header_sticky_mobile}`
              : `${styles.header_sticky} ${isScrolled ? styles.compact : ""}`
          }
        >
          <div className={styles.wrapper}>
            {/* Desktop Menu */}
            {!isMobile && (
              <>
                {/* Logo */}
                <div
                  className={`${styles.logo} ${
                    !isScrolled ? styles.logo_large : styles.logo_small
                  }`}
                >
                  <Link href="/">
                    <img
                      src="/assets/logo.png"
                      alt="Gas Khánh Vân"
                      className={styles.logo_img}
                    />
                  </Link>
                </div>

                {/* Search Bar - Larger */}
                <div className={styles.search_wrap}>
                  <AutoComplete
                    options={options}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    notFoundContent={loading ? "Đang tìm..." : "Không tìm thấy"}
                    className={styles.search_box}
                  >
                    <Input
                      placeholder="Tìm kiếm sản phẩm, danh mục..."
                      prefix={<SearchOutlined className={styles.search_icon} />}
                      suffix={
                        <Flex gap={8}>
                          <AudioOutlined
                            className={styles.action_icon}
                            title="Tìm bằng giọng nói"
                          />
                          <CameraOutlined
                            className={styles.action_icon}
                            title="Tìm bằng hình ảnh"
                          />
                        </Flex>
                      }
                      size="large"
                    />
                  </AutoComplete>
                </div>

                {/* Right Icons */}
                <Flex gap={20} align="center">
                  {/* Hotline */}
                  <Link href="tel:02837731612" className={styles.hotline_link}>
                    <PhoneOutlined className={styles.hotline_icon} />
                    <Flex vertical gap={0}>
                      <Text className={styles.hotline_label}>Hotline</Text>
                      <Text className={styles.hotline_number}>
                        028 3773 1612
                      </Text>
                    </Flex>
                  </Link>

                  <Link href="/gio-hang" className={styles.icon_link}>
                    <Badge count={0} showZero={false}>
                      <ShoppingCartOutlined className={styles.header_icon} />
                    </Badge>
                    <Text className={styles.icon_text}>Giỏ hàng</Text>
                  </Link>

                  <Link href="/tai-khoan" className={styles.icon_link}>
                    <UserOutlined className={styles.header_icon} />
                    <Text className={styles.icon_text}>Tài khoản</Text>
                  </Link>
                </Flex>
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <div className={styles.mobile_header}>
                {/* Drawer Button */}
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setDrawerOpen(true)}
                  className={styles.mobileMenuBtn}
                />
                {/* Search in center */}
                <div className={styles.search_wrap_mobile}>
                  <AutoComplete
                    options={options}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    notFoundContent={loading ? "Đang tìm..." : "Không tìm thấy"}
                    className={styles.search_box_mobile}
                  >
                    <Input
                      placeholder="Tìm sản phẩm..."
                      prefix={<SearchOutlined />}
                    />
                  </AutoComplete>
                </div>
              </div>
            )}
          </div>

          {/* Drawer for Mobile */}
          <Drawer
            title={
              <span
                style={{ fontSize: "16px", fontWeight: 700, color: "#d46b08" }}
              >
                Danh Mục
              </span>
            }
            placement="left"
            closable
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            closeIcon={
              <CloseOutlined style={{ fontSize: "16px", color: "#fa8c16" }} />
            }
            className={styles.mobile_drawer}
            width={280}
            zIndex={1001}
            styles={{
              header: {
                background: "linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)",
                borderBottom: "2px solid #ffa940",
                padding: "12px 16px",
                minHeight: "auto",
              },
              body: {
                padding: "8px 0",
              },
            }}
          >
            <div className={styles.drawer_logo}>
              <Link href="/" onClick={() => setDrawerOpen(false)}>
                <Image
                  src="/assets/logo.png"
                  alt="Gas Khánh Vân"
                  preview={false}
                  width={70}
                  height={70}
                />
              </Link>
            </div>
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode="inline"
              items={items}
              openKeys={openKeys}
              onOpenChange={(keys) => setOpenKeys(keys as string[])}
              className={styles.mobile_menu}
            />
          </Drawer>
        </div>
      </div>
    </>
  );
};

export default SearchHeader;
