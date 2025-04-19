import React from 'react'
import {Badge, Card, Space, Image} from 'antd'
import Link from 'next/link'
import {Cylinder} from '../../../data/cylinders'

const {Meta} = Card

interface ProductCardProps {
  cylinder: Cylinder
}

const ProductCard: React.FC<ProductCardProps> = ({cylinder}) => (
  <>
    <Badge.Ribbon text='Giảm 20%' color='volcano'>
      <Link href={`/product/${cylinder.id}`} passHref>
        <Card hoverable cover={<Image alt='example' src={cylinder?.image} preview={false} />}>
          <Meta
            title='BÌNH GAS GIA ĐÌNH XANH BIỂN 12KG'
            description={
              cylinder.price.toLocaleString('vi', {
                style: 'currency',
                currency: 'VND',
              }) || 'LIÊN HỆ'
            }
          />
        </Card>
      </Link>
    </Badge.Ribbon>
  </>
)

export default ProductCard
