import handleAPI from '@/apis/handleAPI'
import CustomBreadcrumbs, {CustomBreadcrumbItem} from '@/components/common/CustomBreadcrumbs'
import Spinner from '@/components/common/Spinner'
import GasCylinderPage from '@/components/gascylinder/GasCylinderPage'
import CategoryLayout from '@/layouts/CategoryLayout'
import Category from '@/models/Category'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

export const fetchCategoryBySlug = async (slugPath: string) => {
  try {
    const api = `/api/categories/slug/${slugPath}`
    const res: any = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return null
  }
}

export default function CategoryPagePage() {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState<CustomBreadcrumbItem[]>([])
  const [category, setCategory] = useState<Category>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategory = async () => {
      let slugParam = router.query.slug
      if (!slugParam) return

      // normalize slug
      const slugArray = Array.isArray(slugParam) ? slugParam : [slugParam]

      const lastSlug = slugParam[slugParam.length - 1]

      const category = await fetchCategoryBySlug(lastSlug)
      if (category) {
        setCategory(category)
      }
      const breadcrumbItems: CustomBreadcrumbItem[] = await Promise.all(
        slugArray.map(async (s, i) => {
          const cat = await fetchCategoryBySlug(s) // gọi API cho từng slug
          return {
            label: cat?.name || decodeURIComponent(s.replace(/-/g, ' ')),
            href: '/' + slugArray.slice(0, i + 1).join('/'),
          }
        })
      )

      setBreadcrumbs([{label: 'Trang chủ', href: '/'}, ...breadcrumbItems])

      setLoading(false)
    }

    loadCategory()
  }, [router.query.slug])

  if (loading) return <Spinner />
  if (!category) return <>Category not found.</>

  return (
    <CategoryLayout>
      <CustomBreadcrumbs items={breadcrumbs} />
      <GasCylinderPage cate={category} />
    </CategoryLayout>
  )
}
