import {Typography, Menu} from 'antd'
import type {MenuProps} from 'antd'
import {AppstoreOutlined, FireOutlined} from '@ant-design/icons'
import styles from '@/styles/common/FilterSideBar.module.scss'
import {useEffect, useState} from 'react'
import handleAPI from '@/apis/handleAPI'
import {useRouter} from 'next/router'
import Category from '@/models/Category'
import LoadingOverlay from './LoadingOverlay'

const {Title} = Typography

type FilterSideBarProps = {
  title: string
}

type MenuItem = Required<MenuProps>['items'][number]

interface LevelKeysProps {
  key?: string
  children?: LevelKeysProps[]
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {}
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) key[item.key] = level
      if (item.children) func(item.children, level + 1)
    })
  }
  func(items1)
  return key
}

const FilterSideBar = ({title}: FilterSideBarProps) => {
  const router = useRouter()
  const slug = router.query.slug
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined)
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState<boolean>(true) // ✅ loading state
  const [navigating, setNavigating] = useState<boolean>(false) // ✅ loading khi chuyển trang

  // find parent key
  const findParentKey = (items: any[], slug: string): string | undefined => {
    for (const item of items) {
      if (item.children?.some((child: any) => child.key === slug)) return item.key as string
      if (item.children) {
        const found = findParentKey(item.children, slug)
        if (found) return found
      }
    }
    return undefined
  }

  useEffect(() => {
    if (!slug || !items.length) return
    const lastSlug = slug[slug.length - 1]
    const parentKey = findParentKey(items, String(lastSlug))
    if (parentKey) setStateOpenKeys([parentKey])
    else setStateOpenKeys([String(lastSlug)])
    setSelectedSlug(String(lastSlug))
  }, [slug, items])

  useEffect(() => {
    setSelectedSlug(router.query.slug as string | undefined)
  }, [router.query.slug])

  const buildMenuItems = (categories: Category[]): MenuItem[] => {
    return categories
      .filter((cat) => cat.slug !== 'tin-tuc')
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
          router.push(`/${cat.slug}`)
        },
      }))
  }

  const levelKeys = getLevelKeys(items as LevelKeysProps[])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const res: any = await handleAPI('/api/categories', 'get')
        const filtered = res.filter((cat: any) => cat.slug !== 'san-pham')
        const menuItems = buildMenuItems(filtered)
        setItems(menuItems)

        // Prefetch
        filtered.forEach((cat: any) => {
          router.prefetch(`/${cat.slug}`)
          cat.children?.forEach((subCat: any) => router.prefetch(`/${subCat.slug}`))
        })
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const onClick: MenuProps['onClick'] = async (e) => {
    const findItem = (items: any[], key: string): any | undefined => {
      for (const item of items) {
        if (item.key === key) return item
        if (item.children) {
          const found = findItem(item.children, key)
          if (found) return found
        }
      }
      return undefined
    }

    const clickedItem = findItem(items, e.key as string)
    if (clickedItem) {
      setNavigating(true) // ✅ show loading khi chuyển trang
      await router.push(`/${clickedItem.key}`)
      setNavigating(false)
    }

    const parentKey: any = items.find((item: any) =>
      item.children?.some((child: any) => child.key === e.key)
    )?.key

    setStateOpenKeys((prev: any) => {
      const newKeys: any = new Set(prev)
      if (parentKey) newKeys.add(parentKey)
      newKeys.add(e.key)
      return [...newKeys]
    })
  }

  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1)
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey])
      const currentLevelKey = levelKeys[currentOpenKey]

      const currentItem: any = items.filter((item) => item?.key === currentOpenKey)
      if (currentItem && currentItem?.length > 0 && currentItem[0].children.length > 0) {
        openKeys.push(currentItem[0].children[0].key)
      }

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= currentLevelKey)
      )
    } else {
      setStateOpenKeys(openKeys)
    }
  }

  return (
    <div className={styles.filter_bar}>
      <LoadingOverlay spinning={loading || navigating} />

      <Title level={4} style={{display: 'flex', alignItems: 'center', gap: 8}}>
        {title}
      </Title>

      <Menu
        mode='inline'
        selectedKeys={selectedSlug ? [selectedSlug] : []}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        onClick={onClick}
        items={items}
      />
    </div>
  )
}

export default FilterSideBar
