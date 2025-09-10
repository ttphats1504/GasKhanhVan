import React, {useEffect, useState} from 'react'
import CategoryLayout from '@/layouts/CategoryLayout'
import handleAPI from '@/apis/handleAPI'
import Link from 'next/link'
import {Breadcrumb, Col, Row, Card, Typography, Spin, Image} from 'antd'
import FilterSideBar from '@/components/common/FilterSidebar'
import Blog from '@/models/Blog'
import LoadingOverlay from '@/components/common/LoadingOverlay'

const {Title, Paragraph, Text} = Typography

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const res: any = await handleAPI('/api/blogs', 'get')
      setBlogs(res?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <CategoryLayout>
      <LoadingOverlay spinning={loading} />
      <Breadcrumb style={{margin: '16px 0'}}>
        <Breadcrumb.Item href='/'>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Tin tức</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        {/* Sidebar */}
        <Col xs={24} md={6}>
          <FilterSideBar title='Danh mục sản phẩm' />
        </Col>

        {/* Content */}
        <Col xs={24} md={18}>
          <Title level={2} style={{marginBottom: 20, color: 'var(--primary-orange-700)'}}>
            Tin tức
          </Title>

          <Row gutter={[24, 24]}>
            {blogs.map((blog) => (
              <Col key={blog.id} xs={24} sm={12} lg={8}>
                <Link href={`/tin-tuc/${blog.slug}`} style={{textDecoration: 'none'}}>
                  <Card
                    hoverable
                    cover={
                      blog.thumbnail && (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          style={{height: 200, objectFit: 'cover'}}
                          preview={false}
                        />
                      )
                    }
                    style={{borderRadius: 12, overflow: 'hidden'}}
                  >
                    <Title level={4} ellipsis>
                      {blog.title}
                    </Title>
                    <Paragraph ellipsis={{rows: 2}}>
                      {blog.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
                    </Paragraph>
                    <Text type='secondary' style={{fontSize: 12}}>
                      {blog.author || 'Admin'} ·{' '}
                      {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </CategoryLayout>
  )
}
