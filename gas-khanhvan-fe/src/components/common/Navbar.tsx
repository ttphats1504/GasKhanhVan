import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {Menu, Input} from 'antd'
import {MenuUnfoldOutlined} from '@ant-design/icons'
import type {MenuProps} from 'antd'
import Link from 'next/link'
import handleAPI from '@/apis/handleAPI'
import styles from '../../styles/common/Navbar.module.scss'

const {Search} = Input

interface Category {
  id: number
  name: string
  slug: string
  children?: Category[]
}

type MenuItem = Required<MenuProps>['items'][number]

const Navbar = () => {
  const router = useRouter()
  const [current, setCurrent] = useState<string>('category')
  const [items, setItems] = useState<MenuItem[]>([])

  // find key to open menu when slug is children key
  const findParentKey = (items: any[], slug: string): string | undefined => {
    for (const item of items) {
      if (item.children?.some((child: any) => child.key === slug)) {
        return item.key as string
      }
      // 🔁 đệ quy để tìm trong children sâu hơn
      if (item.children) {
        const found = findParentKey(item.children, slug)
        if (found) return found
      }
    }
    return undefined
  }

  const normalizeKey = (key: string) => {
    // remove "group-" or "cat-" prefixes
    return key.replace(/^group-/, '').replace(/^cat-/, '')
  }

  const onClick: MenuProps['onClick'] = (e) => {
    let path = ''
    if (items.length > 0 && e.key) {
      const parentKey = findParentKey(items, e.key)
      if (parentKey) {
        // child => build /parent/child
        path = `/${normalizeKey(parentKey)}/${normalizeKey(e.key)}`
      } else {
        // parent => just /parent
        path = `/${normalizeKey(e.key)}`
      }
    }
    console.log(e.key)
    router.push(path)
    setCurrent(e.key) // still keep menu highlight with original key
  }

  const buildMenuItems = (categories: Category[]): MenuItem[] => {
    const groupedCategoryMenu: MenuItem = {
      label: 'Danh mục sản phẩm',
      key: 'grouped-category', // unique root key
      icon: <MenuUnfoldOutlined />,
      children: categories.map((cat) => ({
        key: `group-${cat.slug}`, // prefix to avoid conflict
        label: cat.name,
        children: cat.children?.map((subCat) => ({
          key: `group-${subCat.slug}`, // nested prefix
          label: subCat.name,
        })),
        onTitleClick: () => {
          router.push(`/${cat.slug}`)
        },
      })),
    }

    const individualCategoryItems: MenuItem[] = categories.map((cat) => ({
      key: `cat-${cat.slug}`, // separate prefix for top-level
      label: cat.name,
    }))

    return [groupedCategoryMenu, ...individualCategoryItems]
  }

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

  // ✅ Sync menu selection with current URL
  useEffect(() => {
    if (!router.isReady) return

    const pathSlug = router.asPath.split('/')[1] || 'category'
    setCurrent(pathSlug)
  }, [router.asPath, router.isReady])

  return (
    <div className={styles.navbar_sticky}>
      <div className={styles.wrapper}>
        <div>
          <Link href='/'>Logo</Link>
        </div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode='horizontal'
          items={items}
          triggerSubMenuAction='hover'
        />
        <div>
          <Search className={styles.search_box} placeholder='Tìm kiếm' />
        </div>
      </div>
    </div>
  )
}

export default Navbar
