import React from 'react'
import {Badge, Card, Space, Image} from 'antd'
import Link from 'next/link'
import Product from '@/models/Product'

const {Meta} = Card

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => (
  <>
    {product && (
      <Badge.Ribbon text='Giảm 20%' color='volcano'>
        <Link href={`/product/${product.id}`} passHref>
          <Card
            hoverable
            cover={
              <Image height='225px' alt='Product image' src={product?.image} preview={false} />
            }
          >
            <Meta
              title={product.name}
              description={
                product.price.toLocaleString('vi', {
                  style: 'currency',
                  currency: 'VND',
                }) || 'LIÊN HỆ'
              }
            />
          </Card>
        </Link>
      </Badge.Ribbon>
    )}
  </>
)

export default ProductCard
