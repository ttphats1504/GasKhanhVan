interface Blog {
  id: number
  title: string
  slug: string
  content: string
  thumbnail?: string
  published: boolean
  createdAt?: string
  updatedAt?: string
}

export default Blog
