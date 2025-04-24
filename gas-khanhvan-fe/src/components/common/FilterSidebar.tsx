import {Typography, Menu} from 'antd'
import type {MenuProps} from 'antd'

import styles from '@/styles/common/FilterSideBar.module.scss'
import {useEffect, useState} from 'react'
import handleAPI from '@/apis/handleAPI'
import {MenuUnfoldOutlined} from '@ant-design/icons'
import Category from '../../../../gkv-server/src/models/CategoryModel'
import {useRouter} from 'next/router'

const {Title} = Typography

type FilterSideBarProps = {
  title: string
}

// const items: MenuItem[] = [
//   {
//     key: '1',
//     label: 'Bình Gas',
//     children: [
//       {key: '11', label: 'Option 1'},
//       {key: '12', label: 'Option 2'},
//       {key: '13', label: 'Option 3'},
//       {key: '14', label: 'Option 4'},
//     ],
//   },
//   {
//     key: '2',
//     label: 'Thiết bị Gas',
//     children: [
//       {key: '21', label: 'Option 1'},
//       {key: '22', label: 'Option 2'},
//     ],
//   },
//   {
//     key: '3',
//     label: 'Hàng tiêu dùng',
//     children: [
//       {key: '31', label: 'Option 1'},
//       {key: '32', label: 'Option 2'},
//       {key: '33', label: 'Option 3'},
//       {key: '34', label: 'Option 4'},
//     ],
//   },
// ]

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
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const selectedSlug = router.query.slug as string | undefined

  const buildMenuItems = (categories: Category[]): MenuItem[] => {
    // Individual categories as top-level items
    const individualCategoryItems: MenuItem[] = categories.map((cat: any) => ({
      key: cat.slug,
      label: cat.name,
      children: cat.children?.map((subCat: any) => ({
        key: subCat.slug,
        label: subCat.name,
      })),
    }))

    // Final combined menu
    return [...individualCategoryItems]
  }

  const levelKeys = getLevelKeys(items as LevelKeysProps[])

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

  const onClick: MenuProps['onClick'] = (e) => {
    const path = e.key.startsWith('/') ? e.key : `/${e.key}`
    router.push(path)

    // // Find the parent of clicked item if any
    // const parentKey: any = items.find((item: any) =>
    //   item.children?.some((child: any) => child.key === e.key)
    // )?.key

    // setStateOpenKeys(parentKey ? [parentKey, e.key] : [e.key])
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

      console.log(openKeys.filter((_, index) => index !== repeatIndex))

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
      <Title level={4}>{title}</Title>
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
