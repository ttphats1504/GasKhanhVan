import React from 'react'
import {Badge, Card, Image, Typography, Space, Rate, Flex} from 'antd'
import Link from 'next/link'
import Product from '@/models/Product'
import formatCurrency from '@/utils/formatCurrency'
import styles from '@/styles/common/ProductCard.module.scss'
import slugify from '@/utils/slugify'

const {Title, Text} = Typography

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => (
  <>
    {product && (
      <Badge.Ribbon text='Giảm 20%' color='volcano'>
        <Link href={`/san-pham/${product.slug}`} passHref>
          <Card
            hoverable
            className={styles.cardWrapper}
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
                {/* {product.oldPrice && (
                  <Text delete type='secondary' style={{fontSize: 13}}>
                    {formatCurrency(product.oldPrice)}
                  </Text>
                )} */}
                <Text delete type='secondary' style={{fontSize: 13}}>
                  {formatCurrency(123000)}
                </Text>
              </Space>
            </Space>
          </Card>
        </Link>
      </Badge.Ribbon>
    )}
  </>
)

export default ProductCard
