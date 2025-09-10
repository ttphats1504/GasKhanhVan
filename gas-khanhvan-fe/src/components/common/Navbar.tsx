import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {Menu, AutoComplete, Input, Image, Typography, Drawer, Button} from 'antd'
import {MenuUnfoldOutlined, MenuOutlined, CloseOutlined} from '@ant-design/icons'
import type {MenuProps} from 'antd'
import Link from 'next/link'
import handleAPI from '@/apis/handleAPI'
import styles from '../../styles/common/Navbar.module.scss'
import formatCurrency from '@/utils/formatCurrency'
import Category from '@/models/Category'
import Product from '@/models/Product'

const {Search} = Input
const {Text} = Typography

type MenuItem = Required<MenuProps>['items'][number]

const Navbar = () => {
  const router = useRouter()
  const [current, setCurrent] = useState<string>('category')
  const [items, setItems] = useState<MenuItem[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 🔹 Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
            <Link href={`/san-pham/${p.slug}`} className={styles.suggest_item} prefetch>
              <Image src={p.image} alt={p.name} className={styles.suggest_img} preview={false} />
              <div>
                <div className={styles.suggest_name}>{p.name}</div>
                <div className={styles.suggest_price}>{formatCurrency(p.price)}</div>
                <Text delete type='secondary' style={{fontSize: 13}}>
                  {formatCurrency(p.old_price)}
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
      <div className={isMobile ? `${styles.navbar_sticky_mobile}` : `${styles.navbar_sticky}`}>
        <div className={styles.wrapper}>
          {/* Desktop Menu */}
          {!isMobile && (
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode='horizontal'
              items={items}
              triggerSubMenuAction='hover'
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
