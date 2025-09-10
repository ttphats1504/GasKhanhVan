import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {Menu, AutoComplete, Input, Image, Typography, Drawer, Button, Card, Flex} from 'antd'
import {
  MenuUnfoldOutlined,
  MenuOutlined,
  CloseOutlined,
  LockOutlined,
  SearchOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import type {MenuProps} from 'antd'
import Link from 'next/link'
import handleAPI from '@/apis/handleAPI'
import styles from '../../styles/common/SearchHeader.module.scss'
import formatCurrency from '@/utils/formatCurrency'
import Category from '@/models/Category'
import Product from '@/models/Product'
import {fail} from 'assert'

const {Search} = Input
const {Text} = Typography

type MenuItem = Required<MenuProps>['items'][number]

const SearchHeader = () => {
  const router = useRouter()
  const [current, setCurrent] = useState<string>('category')
  const [items, setItems] = useState<MenuItem[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])

  // 🔹 Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 🔹 Khi click gợi ý
  const handleSuggestionClick = (keyword: string) => {
    handleSearch(keyword) // gọi lại search API
  }

  useEffect(() => {
    if (drawerOpen) {
      const groupKeys: string[] = []
      const collectKeys = (items: any[]) => {
        items.forEach((item) => {
          if (item.children && item.key) {
            groupKeys.push(item.key as string)
            collectKeys(item.children)
          }
        })
      }
      collectKeys(items)
      setOpenKeys(groupKeys)
    }
  }, [drawerOpen, items])

  // 🔹 Find parent key for child navigation
  const findParentKey = (items: any[], slug: string): string | undefined => {
    for (const item of items) {
      if (item.children?.some((child: any) => child.key === slug)) {
        return item.key as string
      }
      if (item.children) {
        const found = findParentKey(item.children, slug)
        if (found) return found
      }
    }
    return undefined
  }

  const normalizeKey = (key: string) => {
    return key.replace(/^group-/, '').replace(/^cat-/, '')
  }

  const onClick: MenuProps['onClick'] = (e) => {
    let path = ''
    if (items.length > 0 && e.key) {
      const parentKey = findParentKey(items, e.key)
      if (parentKey) {
        path = `/${normalizeKey(parentKey)}/${normalizeKey(e.key)}`
      } else {
        path = `/${normalizeKey(e.key)}`
      }
    }
    router.push(path)
    setCurrent(e.key)
    setDrawerOpen(false) // đóng drawer khi chọn
  }

  // 🔹 Build menu items
  const buildMenuItems = (categories: Category[]): MenuItem[] => {
    const groupedCategoryMenu: MenuItem = {
      label: 'Danh mục sản phẩm',
      key: 'grouped-category',
      icon: <MenuUnfoldOutlined />,
      children: categories
        .filter((cat) => cat.slug !== 'tin-tuc')
        .map((cat) => ({
          key: `group-${cat.slug}`,
          label: cat.name,
          children: cat.children?.map((subCat) => ({
            key: `group-${subCat.slug}`,
            label: subCat.name,
          })),
          onTitleClick: () => {
            router.push(`/${cat.slug}`)
            setDrawerOpen(false)
          },
        })),
    }

    const individualCategoryItems: MenuItem[] = categories.map((cat) => ({
      key: `cat-${cat.slug}`,
      label: cat.name,
      onClick: () => {
        if (cat.slug === 'blog') {
          router.push('/tin-tuc')
        } else {
          router.push(`/${cat.slug}`)
        }
        setDrawerOpen(false)
      },
    }))

    return [groupedCategoryMenu, ...individualCategoryItems]
  }

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await handleAPI('/api/categories', 'get')
        const filtered = res.filter((cat: any) => cat.slug !== 'san-pham')
        const menuItems = buildMenuItems(filtered)
        setItems(menuItems)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // 🔹 Sync menu highlight with URL
  useEffect(() => {
    if (!router.isReady) return
    const pathSlug = router.asPath.split('/')[1] || 'category'
    setCurrent(pathSlug)
  }, [router.asPath, router.isReady])

  // 🔹 Search suggestions
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setOptions([])
      return
    }
    setLoading(true)
    try {
      const res: any = await handleAPI(`/api/products?search=${value}`, 'get')
      const products: Product[] = res.data || []
      setOptions(
        products.map((p) => ({
          value: p.slug,
          label: (
            <Link href={`/san-pham/${p.slug}`} className={styles.suggest_item}>
              <Image src={p.image} alt={p.name} className={styles.suggest_img} preview={false} />
              <div>
                <div className={styles.suggest_name}>{p.name}</div>
                <div className={styles.suggest_price}>{formatCurrency(p.price)}</div>
                <Text delete type='secondary' style={{fontSize: 13}}>
                  {p.old_price > 0 ? formatCurrency(p.old_price) : formatCurrency(p.price)}
                </Text>
              </div>
            </Link>
          ),
        }))
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onSelect = (slug: string) => {
    router.push(`/san-pham/${slug}`)
    setDrawerOpen(false)
  }

  // 🔹 Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {isMobile && (
        <div className={styles.logo_mobile}>
          <Image src='/assets/logo.png' alt='Gas quan 7' width={84} height={84} preview={false} />
        </div>
      )}
      <div className={isMobile ? `${styles.header_sticky_mobile}` : `${styles.header_sticky}`}>
        <div className={styles.wrapper}>
          {/* Desktop Menu */}
          {!isMobile && (
            <>
              {/* Logo */}
              <div className={styles.logo}>
                <Link href='/'>
                  <Image
                    src='/assets/logo.png'
                    alt='Gas quan 7'
                    width={124}
                    height={124}
                    preview={false}
                  />
                </Link>
              </div>
              <div className={styles.search_wrap}>
                <AutoComplete
                  options={options}
                  onSelect={onSelect}
                  onSearch={handleSearch}
                  notFoundContent={loading ? 'Đang tìm...' : 'Không tìm thấy'}
                  className={styles.search_box}
                >
                  <Input placeholder='Tìm sản phẩm...' prefix={<SearchOutlined />} />
                </AutoComplete>
              </div>
              <Button
                type='primary'
                icon={<PhoneOutlined />}
                className={styles.contact_btn}
                onClick={() => (window.location.href = 'tel:02837731612')}
              >
                <Flex vertical>
                  <span>028 3773 1612</span>
                  <span>Gọi ngay</span>
                </Flex>
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className={styles.mobile_header}>
              {/* Drawer Button */}
              <Button
                type='text'
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
                  notFoundContent={loading ? 'Đang tìm...' : 'Không tìm thấy'}
                  className={styles.search_box_mobile}
                >
                  <Input placeholder='Tìm sản phẩm...' prefix={<SearchOutlined />} />
                </AutoComplete>
              </div>
            </div>
          )}
        </div>

        {/* Drawer for Mobile */}
        <Drawer
          title='Menu'
          placement='left'
          closable
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          closeIcon={<CloseOutlined />}
        >
          <div className={styles.logo}>
            <Link href='/'>
              <Image
                src='/assets/logo.png'
                alt='Gas quan 7'
                preview={false}
                width={84}
                height={84}
              />
            </Link>
          </div>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode='inline'
            items={items}
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys as string[])}
          />
        </Drawer>
      </div>
    </>
  )
}

export default SearchHeader
