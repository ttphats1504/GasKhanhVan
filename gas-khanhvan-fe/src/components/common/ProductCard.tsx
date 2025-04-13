import React from 'react'
import {Badge, Card, Space, Image} from 'antd'
import Link from 'next/link'
import Product from '@/models/Product'

const {Meta} = Card

interface ProductCardProps {
  cylinder: Product
}

const ProductCard: React.FC<ProductCardProps> = ({cylinder}) => (
  <>
    <Badge.Ribbon text='Giảm 20%' color='volcano'>
      <Link href={`/product/${cylinder.id}`} passHref>
        <Card
          hoverable
          cover={
            <div style={{width: '100%', height: '225px', overflow: 'hidden'}}>
              <Image alt='example' src={cylinder?.image} preview={false} />
            </div>
          }
        >
          <Meta
            title={cylinder?.name}
            description={
              cylinder.price.toLocaleString('vi', {style: 'currency', currency: 'VND'}) || 'LIÊN HỆ'
            }
          />
        </Card>
      </Link>
    </Badge.Ribbon>
  </>
)

export default ProductCard
