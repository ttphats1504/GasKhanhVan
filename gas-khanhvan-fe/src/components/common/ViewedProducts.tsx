// components/common/ViewedProducts.tsx
import React, {useEffect, useState} from 'react'
import {Row, Col, Typography, Pagination} from 'antd'
import ProductCard from './ProductCard'
import Product from '@/models/Product'

const {Title} = Typography

interface ViewedProductsProps {
  excludeProductId?: number // Sản phẩm hiện tại không hiển thị
  pageSize?: number
}

const ViewedProducts: React.FC<ViewedProductsProps> = ({excludeProductId, pageSize = 4}) => {
  const [viewedProducts, setViewedProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('viewedProducts') || '[]') as Product[]
    let filtered = stored
    if (excludeProductId) {
      filtered = stored.filter((p) => parseInt(p.id) !== excludeProductId)
    }
    setViewedProducts(filtered)
    setCurrentPage(1)
  }, [excludeProductId])

  if (!viewedProducts || viewedProducts.length === 0) return null

  const total = viewedProducts.length
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = currentPage * pageSize
  const pagedProducts = viewedProducts.slice(startIndex, endIndex)

  return (
    <div style={{marginTop: 40}}>
      <Title level={3}>Sản phẩm đã xem</Title>
      <Row gutter={[16, 16]}>
        {pagedProducts.map((p) => (
          <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={p} />
          </Col>
        ))}
      </Row>
      {total > pageSize && (
        <Row justify='center' style={{marginTop: 20}}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={(page) => setCurrentPage(page)}
          />
        </Row>
      )}
    </div>
  )
}

export default ViewedProducts
