import { MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Input, Menu } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";

import styles from "../../styles/common/Navbar.module.scss";
const { Search } = Input;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Danh mục sản phẩm",
    key: "category",
    icon: <MenuUnfoldOutlined />,
    children: [
      {
        key: "11",
        label: "Option 1",
        children: [
          { key: "111", label: "Sub Option 1-1" },
          { key: "112", label: "Sub Option 1-2" },
        ],
      },
      {
        key: "12",
        label: "Option 2",
        children: [
          { key: "121", label: "Sub Option 2-1" },
          { key: "122", label: "Sub Option 2-2" },
        ],
      },
      {
        key: "13",
        label: "Option 3",
        children: [
          { key: "131", label: "Sub Option 3-1" },
          { key: "132", label: "Sub Option 3-2" },
        ],
      },
      {
        key: "14",
        label: "Option 4",
        children: [
          { key: "141", label: "Sub Option 4-1" },
          { key: "142", label: "Sub Option 4-2" },
        ],
      },
    ],
  },
  {
    label: "Bình Gas",
    key: "binh-gas",
  },
  {
    label: "Bếp Gas",
    key: "bep-gas",
  },
  {
    label: "Phụ kiện Gas",
    key: "phu-kien-gas",
  },
  {
    label: "Gia dụng",
    key: "gia-dung",
  },
];

const Navbar = () => {
  const router = useRouter();
  const [current, setCurrent] = useState("category");

  const onClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
    setCurrent(e.key);
  };

  return (
    <div className={styles.navbar_sticky}>
      <div className={styles.wrapper}>
        <div>Logo</div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          triggerSubMenuAction="hover"
        />
        <div>
          <Search className={styles.search_box} placeholder="Tìm kiếm" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
