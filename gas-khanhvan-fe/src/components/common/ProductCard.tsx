import React from 'react'
import {Badge, Card, Image, Typography, Space, Rate, Flex} from 'antd'
import Link from 'next/link'
import Product from '@/models/Product'
import formatCurrency from '@/utils/formatCurrency'
import styles from '@/styles/common/ProductCard.module.scss'
import {useRouter} from 'next/router'

const {Title, Text} = Typography

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/san-pham/${product.slug}`).then(() => {
      router.reload() // reload toàn bộ trang
    })
  }
  // ✅ Tính phần trăm giảm giá
  const discountPercent =
    product.old_price && product.old_price > product.price
      ? Math.round(
          ((Number(product.old_price) - Number(product.price)) / Number(product.old_price)) * 100
        )
      : 0

  // ✅ Thẻ Card sản phẩm
  const cardContent = (
    <Card
      hoverable
      className={styles.cardWrapper}
      onClick={handleClick}
      cover={
        <div className={styles.imageWrapper}>
          <Image
            alt='Product image'
            src={product?.image}
            preview={false}
            className={styles.productImage}
          />
          <div className={styles.shinyEffect} />
        </div>
      }
    >
      <Space direction='vertical' size={6} style={{width: '100%'}}>
        {/* Tên sản phẩm */}
        <Title level={5} ellipsis={{rows: 2}} className={styles.product_name}>
          {product.name}
        </Title>

        {/* Rating */}
        <Flex gap={'small'} vertical>
          <Rate disabled defaultValue={4.5} style={{fontSize: 12}} />
          <Text type='secondary'>({10} đánh giá)</Text>
        </Flex>

        {/* Giá sản phẩm */}
        <Space direction='vertical' size={0}>
          <Text strong style={{fontSize: 16, color: '#cf1322'}}>
            {formatCurrency(product.price) || 'LIÊN HỆ'}
          </Text>
          {product.old_price > 0 && product.old_price > product.price ? (
            <Text delete type='secondary' style={{fontSize: 13}}>
              {formatCurrency(product.old_price)}
            </Text>
          ) : (
            <Text delete type='secondary' style={{fontSize: 13}}>
              {formatCurrency(product.price)}
            </Text>
          )}
        </Space>
      </Space>
    </Card>
  )

  // ✅ Nếu có giảm giá thì bọc bằng Badge.Ribbon, nếu không thì render Card bình thường
  return discountPercent > 0 ? (
    <Badge.Ribbon text={`Giảm ${discountPercent}%`} color='volcano'>
      {cardContent}
    </Badge.Ribbon>
  ) : (
    cardContent
  )
}

export default ProductCard
