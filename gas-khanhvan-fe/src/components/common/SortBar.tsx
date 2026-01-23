import React from 'react';
import { Select, Space, Typography } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import styles from '@/styles/common/SortBar.module.scss';

const { Text } = Typography;

export type SortOption = 
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest'
  | 'discount';

interface SortBarProps {
  value?: SortOption;
  onChange?: (value: SortOption) => void;
  totalItems?: number;
}

const SortBar: React.FC<SortBarProps> = ({ 
  value = 'default', 
  onChange,
  totalItems = 0 
}) => {
  const sortOptions = [
    { label: 'Mặc định', value: 'default' },
    { label: 'Giá: Thấp đến cao', value: 'price-asc' },
    { label: 'Giá: Cao đến thấp', value: 'price-desc' },
    { label: 'Tên: A → Z', value: 'name-asc' },
    { label: 'Tên: Z → A', value: 'name-desc' },
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Khuyến mãi', value: 'discount' },
  ];

  return (
    <div className={styles.sortBar}>
      <Space size="middle" wrap>
        <Space size="small">
          <SortAscendingOutlined className={styles.icon} />
          <Text strong>Sắp xếp:</Text>
        </Space>
        
        <Select
          value={value}
          onChange={onChange}
          options={sortOptions}
          className={styles.select}
          style={{ minWidth: 180 }}
        />

        {totalItems > 0 && (
          <Text type="secondary" className={styles.totalItems}>
            ({totalItems} sản phẩm)
          </Text>
        )}
      </Space>
    </div>
  );
};

export default SortBar;

