import handleAPI from '@/apis/handleAPI'
import GasCylinderPage from '@/components/gascylinder/GasCylinderPage'
import CategoryLayout from '@/layouts/CategoryLayout'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

export const fetchCategoryBySlug = async (slug: string) => {
  try {
    const api = `/api/categories/slug/${slug}`
    const res: any = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return null
  }
}

export default function CategoryPagePage() {
  const router = useRouter()
  const [categoryId, setCategoryId] = useState<number>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategory = async () => {
      if (router.query.slug) {
        const category = await fetchCategoryBySlug(router.query.slug as string)
        if (category) {
          setCategoryId(category.id)
        }
        setLoading(false)
      }
    }

    loadCategory()
  }, [router.query.slug])

  if (loading) return <>Loading...</>
  if (!categoryId) return <>Category not found.</>

  return (
    <CategoryLayout>
      <GasCylinderPage categoryId={categoryId} />
    </CategoryLayout>
  )
}
