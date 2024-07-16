import {AppstoreOutlined, MenuUnfoldOutlined, SettingOutlined} from '@ant-design/icons'
import type {MenuProps} from 'antd'
import {Menu} from 'antd'
import {useState} from 'react'

import styles from '../../styles/common/Navbar.module.scss'

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    label: 'Danh mục sản phẩm',
    key: 'category',
    icon: <MenuUnfoldOutlined />,
    children: [
      {
        key: '11',
        label: 'Option 1',
        children: [
          {key: '111', label: 'Sub Option 1-1'},
          {key: '112', label: 'Sub Option 1-2'},
        ],
      },
      {
        key: '12',
        label: 'Option 2',
        children: [
          {key: '121', label: 'Sub Option 2-1'},
          {key: '122', label: 'Sub Option 2-2'},
        ],
      },
      {
        key: '13',
        label: 'Option 3',
        children: [
          {key: '131', label: 'Sub Option 3-1'},
          {key: '132', label: 'Sub Option 3-2'},
        ],
      },
      {
        key: '14',
        label: 'Option 4',
        children: [
          {key: '141', label: 'Sub Option 4-1'},
          {key: '142', label: 'Sub Option 4-2'},
        ],
      },
    ],
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: <AppstoreOutlined />,
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {label: 'Option 5', key: 'submenu:5'},
      {label: 'Option 6', key: 'submenu:6'},
    ],
  },
  {
    key: 'alipay',
    label: (
      <a href='https://ant.design' target='_blank' rel='noopener noreferrer'>
        Navigation Four - Link
      </a>
    ),
  },
]

const Navbar = () => {
  const [current, setCurrent] = useState('category')

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }

  return (
    <div className={styles.navbar_sticky}>
      <div className={styles.wrapper}>
        <div>Logo</div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode='horizontal'
          items={items}
          triggerSubMenuAction='hover'
        />
        <div>Search Section</div>
      </div>
    </div>
  )
}

export default Navbar
