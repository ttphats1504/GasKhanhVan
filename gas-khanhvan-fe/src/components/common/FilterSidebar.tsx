import {Typography, Menu} from 'antd'
import type {MenuProps} from 'antd'
import {FilterOutlined, FireOutlined} from '@ant-design/icons'
import styles from '@/styles/common/FilterSideBar.module.scss'
import {useEffect, useState} from 'react'
import handleAPI from '@/apis/handleAPI'
import {useRouter} from 'next/router'
import Category from '@/models/Category'

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
      if (item.key) {
        key[item.key] = level
      }
      if (item.children) {
        func(item.children, level + 1)
      }
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

  useEffect(() => {
    if (!slug || !items.length) return

    const lastSlug = slug[slug.length - 1]

    const parentKey = findParentKey(items, String(lastSlug))
    if (parentKey) {
      setStateOpenKeys([parentKey])
    } else {
      setStateOpenKeys([String(lastSlug)])
    }

    setSelectedSlug(String(lastSlug))
  }, [slug, items])

  useEffect(() => {
    setSelectedSlug(router.query.slug as string | undefined)
  }, [router.query.slug])

  const buildMenuItems = (categories: Category[]): MenuItem[] => {
    // Individual categories as top-level items
    const individualCategoryItems: MenuItem[] = categories.map((cat: any) => ({
      key: cat.slug,
      label: cat.name,
      children: cat.children?.map((subCat: any) => ({
        key: subCat.slug,
        label: subCat.name,
      })),
      onTitleClick: () => {
        router.push(`/${cat.slug}`)
      },
    }))

    // Final combined menu
    return [...individualCategoryItems]
  }

  const levelKeys = getLevelKeys(items as LevelKeysProps[])

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

  const buildFullPath = (key: string, items: any[]): string => {
    for (const item of items) {
      if (item.key === key) return `/${key}`
      if (item.children) {
        const found = buildFullPath(key, item.children)
        if (found) return `/${item.key}${found}`
      }
    }
    return ''
  }

  const onClick: MenuProps['onClick'] = (e) => {
    // tìm item được click
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

    console.log(clickedItem)

    // Nếu là parent có children → vẫn route về /slug cha
    if (clickedItem) {
      const path = `/${clickedItem.key}`
      router.push(path)
    }

    // Giữ state open
    const parentKey: any = items.find((item: any) =>
      item.children?.some((child: any) => child.key === e.key)
    )?.key

    setStateOpenKeys((prev: any) => {
      const newKeys: any = new Set(prev)
      if (parentKey) newKeys.add(parentKey)
      newKeys.add(e.key) // ✅ giữ item được click mở
      return [...newKeys]
    })
  }

  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1)

    // open
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
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= currentLevelKey)
      )
    } else {
      // close
      setStateOpenKeys(openKeys)
    }
  }
  return (
    <div className={styles.filter_bar}>
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
