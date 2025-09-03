interface Category {
  id: number
  name: string
  image: string
  slug: string
  children?: Category[]
}

export default Category
