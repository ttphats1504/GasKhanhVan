import React from 'react'
import {Card, Col, Row, Skeleton} from 'antd'

interface BlogCardSkeletonProps {
  count?: number
}

const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({count = 6}) => {
  return (
    <Row gutter={[24, 24]}>
      {Array.from({length: count}).map((_, index) => (
        <Col key={index} xs={24} sm={12} lg={8}>
          <Card
            style={{borderRadius: 12, overflow: 'hidden'}}
            cover={
              <Skeleton.Image
                active
                style={{width: '100%', height: 200}}
              />
            }
          >
            <Skeleton active paragraph={{rows: 3}} />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default BlogCardSkeleton

