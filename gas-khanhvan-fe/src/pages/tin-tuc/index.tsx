import React, {useEffect, useState} from 'react'
import CategoryLayout from '@/layouts/CategoryLayout'
import handleAPI from '@/apis/handleAPI'
import Link from 'next/link'
import {Breadcrumb, Col, Image, Row} from 'antd'
import FilterSideBar from '@/components/common/FilterSidebar'
import Blog from '@/models/Blog'

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
      <Breadcrumb style={{margin: '16px 0'}}>
        <Breadcrumb.Item href='/'>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Tin tức</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={32}>
        <Col sm={24} md={6}>
          <FilterSideBar title='Danh mục sản phẩm' />
        </Col>
        <Col sm={24} md={18}>
          <h1 style={{marginBottom: 20}}>Tin tức</h1>
          {loading && <p>Loading...</p>}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
              gap: 20,
            }}
          >
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/tin-tuc/${blog.slug}`}
                style={{textDecoration: 'none', color: 'inherit'}}
              >
                <article
                  style={{
                    border: '1px solid #eee',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  {blog.thumbnail && (
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      style={{width: '100%', height: 180, objectFit: 'cover'}}
                      preview={false}
                    />
                  )}
                  <div style={{padding: 16}}>
                    <h3>{blog.title}</h3>
                    <p style={{fontSize: 14, color: '#666'}}>
                      {blog.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
                    </p>
                    <p style={{fontSize: 12, color: '#999'}}>
                      {blog.author || 'Admin'} · {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </Col>
      </Row>
    </CategoryLayout>
  )
}
