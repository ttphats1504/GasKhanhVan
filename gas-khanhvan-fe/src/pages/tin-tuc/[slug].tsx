import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {Col, Row, Typography, Image, Empty, Flex, Card, Divider, Breadcrumb} from 'antd'
import handleAPI from '@/apis/handleAPI'
import styles from '@/styles/blog/BlogDetailPage.module.scss'
import CategoryLayout from '@/layouts/CategoryLayout'
import Blog from '@/models/Blog'

const {Title, Paragraph, Text} = Typography

const fetchBlogBySlug = async (slug: string) => {
  try {
    const res = await handleAPI(`/api/blogs/slug/${slug}`, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Blog:', error)
    return null
  }
}

const fetchLatestBlogs = async () => {
  try {
    const res = await handleAPI(`/api/blogs?limit=5`, 'get')
    return res?.data || []
  } catch (error) {
    console.error('Error fetching Blogs:', error)
    return []
  }
}

const BlogDetailPage = () => {
  const router = useRouter()
  const {slug} = router.query
  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      setLoading(true)
      const [blogRes, latestRes]: any = await Promise.all([
        fetchBlogBySlug(slug as string),
        fetchLatestBlogs(),
      ])
      if (blogRes) setBlog(blogRes)
      if (latestRes) setRelatedBlogs(latestRes)
      setLoading(false)
    }
    load()
  }, [slug])

  if (!blog) return <Empty description='Không tìm thấy bài viết' />

  return (
    <CategoryLayout>
      <Breadcrumb style={{margin: '16px 0'}}>
        <Breadcrumb.Item href='/'>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item href='/tin-tuc'>Tin tức</Breadcrumb.Item>
        <Breadcrumb.Item>{blog.title}</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={32}>
        {/* Nội dung bài viết */}
        <Col sm={24} md={18}>
          <Card>
            <Flex vertical>
              <Title level={2}>{blog.title}</Title>
              <Text type='secondary'>{new Date(blog.createdAt).toLocaleDateString()}</Text>
              {blog.thumbnail && (
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  preview={false}
                  className={styles.thumbnail}
                />
              )}
              <div className={styles.content} dangerouslySetInnerHTML={{__html: blog.content}} />
            </Flex>
          </Card>
        </Col>
        {/* Sidebar tin tức khác */}
        <Col sm={24} md={6}>
          <Card title='Bài viết mới nhất' size='small'>
            {relatedBlogs.map((b: any) => (
              <div
                key={b.id}
                className={styles.related_item}
                onClick={() => router.push(`/tin-tuc/${b.slug}`)}
              >
                <Image src={b.thumbnail} alt={b.title} preview={false} width='100%' />
                <Text strong>{b.title}</Text>
                <Divider />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </CategoryLayout>
  )
}

export default BlogDetailPage
