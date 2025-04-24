import handleAPI from '@/apis/handleAPI'
import CustomBreadcrumbs, {CustomBreadcrumbItem} from '@/components/common/CustomBreadcrumbs'
import Spinner from '@/components/common/Spinner'
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
  const [breadcrumbs, setBreadcrumbs] = useState<CustomBreadcrumbItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategory = async () => {
      const slug = router.query.slug as string
      if (!slug) return

      const category = await fetchCategoryBySlug(slug)
      if (category) {
        setCategoryId(category.id)

        const items: CustomBreadcrumbItem[] = [{label: 'Trang chủ', href: '/'}]

        items.push({
          label: category.name,
          href: `${category.slug}`,
        })
        console.log(items)
        setBreadcrumbs(items)
      }

      setLoading(false)
    }

    loadCategory()
  }, [router.query.slug])

  if (loading) return <Spinner />
  if (!categoryId) return <>Category not found.</>

  return (
    <CategoryLayout>
      <CustomBreadcrumbs items={breadcrumbs} />
      <GasCylinderPage categoryId={categoryId} />
    </CategoryLayout>
  )
}
