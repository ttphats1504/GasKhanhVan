import GasCylinderPage from '@/components/gascylinder/GasCylinderPage'
import RoutingPath from '@/configs/routing'
import CategoryLayout from '@/layouts/CategoryLayout'
import {useRouter} from 'next/router'

export default function CategoryPagePage() {
  const router = useRouter()
  if (!router.query.slug) {
    return <></>
  }

  return (
    <CategoryLayout>
      <GasCylinderPage />
    </CategoryLayout>
  )
}
