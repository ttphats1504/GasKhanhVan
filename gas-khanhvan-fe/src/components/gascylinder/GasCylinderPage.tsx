import {Carousel, Col, Empty, Flex, Image, Layout, Row, Typography} from 'antd'
import styles from '@/styles/gascylinder/GasCylinderPage.module.scss'
import FilterSideBar from '../common/FilterSidebar'
import ProductCard from '../common/ProductCard'
import handleAPI from '@/apis/handleAPI'
import Product from '../../../../gkv-admin/src/models/Product'
import {useEffect, useState} from 'react'
import Category from '@/models/Category'
import Brand from '@/models/Brand'
import LoadingOverlay from '../common/LoadingOverlay'
import BrandsCarousel from '../common/BrandsCarousel'

interface Props {
  cate: Category | undefined
  selectedBrand?: number | null // <- nhận từ ngoài
}

const {Title} = Typography

const fetchCategoryById = async (categoryId: number) => {
  const api = `/api/categories/${categoryId}`
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Products:', error)
    return []
  }
}

const fetchBannerImages = async () => {
  const api = '/api/banners'
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Banners:', error)
    return []
  }
}

const GasCylinderPage = ({cate, selectedBrand: selectedBrandProp}: Props) => {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>()
  const [banners, setBanners] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState<number | null>(selectedBrandProp || null)

  // Cập nhật selectedBrand nếu prop thay đổi từ ngoài
  useEffect(() => {
    setSelectedBrand(selectedBrandProp || null)
  }, [selectedBrandProp])

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res: any = await handleAPI('/api/brands', 'get')
        setBrands(res?.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBrands()
  }, [])

  useEffect(() => {
    setProducts([])
    setBanners([])
    setCategory(null)

    const fetchData = async () => {
      setLoading(true)

      let typeIds: number[] = []
      if (cate) {
        typeIds.push(cate.id)
        // Nếu category có children, lấy id của children
        if (cate.children && cate.children.length > 0) {
          typeIds.push(...cate.children.map((c) => c.id))
        }
      }

      let productApi = '/api/products?'
      if (selectedBrand) {
        productApi += `brandId=${selectedBrand}`
        if (typeIds.length) productApi += `&typeId=${typeIds.join(',')}`
      } else if (typeIds.length) {
        productApi += `typeId=${typeIds.join(',')}`
      }

      const [productRes, bannerRes, cateRes]: any = await Promise.all([
        handleAPI(productApi, 'get'),
        fetchBannerImages(),
        cate ? fetchCategoryById(cate.id) : Promise.resolve(null),
      ])

      if (productRes?.totalItems) setProducts(productRes.data)
      if (cateRes) setCategory(cateRes)
      if (bannerRes?.length) setBanners(bannerRes.map((b: any) => b.image))

      setLoading(false)
    }

    fetchData()
  }, [cate?.id, selectedBrand])

  const titleText = selectedBrand
    ? brands.find((b) => b.id === selectedBrand)?.name
    : category?.name

  return (
    <div className={styles.wrapper}>
      <LoadingOverlay spinning={loading} />
      <Carousel autoplay className={styles.carousel}>
        {banners.map((url, index) => (
          <div key={index}>
            <Image src={url} alt={`Banner ${index}`} className={styles.carousel_image} />
          </div>
        ))}
      </Carousel>

      {brands.length > 0 && (
        <BrandsCarousel
          brands={brands}
          onSelect={(brandId) => setSelectedBrand(brandId)}
          selectedBrand={selectedBrand}
        />
      )}

      <div>
        <Row gutter={32}>
          <Col xs={24} md={6}>
            <FilterSideBar title='Danh mục sản phẩm' />
          </Col>

          <Col xs={24} md={18}>
            <Flex vertical>
              {titleText && <Title level={3}>{titleText}</Title>}

              <Row gutter={[16, 16]}>
                {products.length > 0 ? (
                  products.map((cylinder: any) => (
                    <Col key={cylinder.id} xs={12} sm={12} md={8} lg={8} xl={8} xxl={6}>
                      <ProductCard product={cylinder} />
                    </Col>
                  ))
                ) : (
                  <Empty description={<>Chưa có sản phẩm nào</>} />
                )}
              </Row>
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default GasCylinderPage
