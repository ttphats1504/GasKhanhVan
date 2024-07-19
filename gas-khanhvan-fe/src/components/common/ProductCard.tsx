import React from 'react'
import {Badge, Card, Space, Image} from 'antd'
const {Meta} = Card

const ProductCard = () => (
  <>
    <Badge.Ribbon text='Giảm 20%' color='volcano'>
      <Card hoverable cover={<Image alt='example' src='/assets/gas/xanh-petrolimex.png' />}>
        <Meta title='BÌNH GAS GIA ĐÌNH XANH BIỂN 12KG' description='LIÊN HỆ' />
      </Card>
    </Badge.Ribbon>
  </>
)

export default ProductCard
