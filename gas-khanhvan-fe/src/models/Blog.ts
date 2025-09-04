interface Blog {
  id: number
  title: string
  slug: string
  thumbnail?: string | null
  content: string
  author?: string | null
  published: boolean
  createdAt: string
}

export default Blog
