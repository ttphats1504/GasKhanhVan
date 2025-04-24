import {MenuUnfoldOutlined} from '@ant-design/icons'
import type {MenuProps} from 'antd'
import {Input, Menu} from 'antd'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'

import styles from '../../styles/common/Navbar.module.scss'
import Link from 'next/link'
import handleAPI from '@/apis/handleAPI'

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
  const [current, setCurrent] = useState('category')
  const [items, setItems] = useState<MenuItem[]>([])

  const onClick: MenuProps['onClick'] = (e) => {
    const path = e.key.startsWith('/') ? e.key : `/${e.key}`
    router.push(path)
    setCurrent(e.key)
  }

  const buildMenuItems = (categories: Category[]): MenuItem[] => {
    // Grouped under "Danh mục sản phẩm"
    const groupedCategoryMenu: MenuItem = {
      label: 'Danh mục sản phẩm',
      key: 'category',
      icon: <MenuUnfoldOutlined />,
      children: categories.map((cat) => ({
        key: cat.slug,
        label: cat.name,
        children: cat.children?.map((subCat) => ({
          key: subCat.slug,
          label: subCat.name,
        })),
      })),
    }

    // Individual categories as top-level items
    const individualCategoryItems: MenuItem[] = categories.map((cat) => ({
      key: cat.slug,
      label: cat.name,
    }))

    // Final combined menu
    return [groupedCategoryMenu, ...individualCategoryItems]
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await handleAPI('/api/categories', 'get')
        const menuItems = buildMenuItems(res)
        setItems(menuItems)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    fetchCategories()
  }, [])

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
