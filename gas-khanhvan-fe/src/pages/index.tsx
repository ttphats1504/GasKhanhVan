import React, {useEffect, useState} from 'react'
import PromotionCarousel from '@/components/common/PromotionCarousel'
import Incentives from '@/components/common/IncentivesSection'

import styles from '@/styles/home/Home.module.scss'
import ProductSection from '@/components/home/ProductSection'
import Head from 'next/head'
import SaleBanner from '@/components/common/SaleBanner'
import HomeLayout from '@/layouts/HomeLayout'
import handleAPI from '@/apis/handleAPI'
import Category from '@/models/Category'
import {Flex, Typography} from 'antd'
import Brand from '@/models/Brand'
import LoadingOverlay from '@/components/common/LoadingOverlay'

const {Title} = Typography

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // fetch categories
        const categoryRes: any = await handleAPI('/api/categories', 'get')
        const filteredCategory = categoryRes.filter((cat: any) => cat.slug !== 'san-pham')
        setCategories(filteredCategory)

        // fetch brands
        const brandRes: any = await handleAPI('/api/brands', 'get')
        setBrands(brandRes.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Head>
        <title>Cửa Hàng Gas Khánh Vân - Gas Quận 7 Uy Tín Và Chất Lượng</title>
        <meta
          name='google-site-verification'
          content='1576YrYuw5N2zO2oH75ShLXhWDn9rbJAd8DSNBcQYIs'
        />
        <meta
          property='og:title'
          content='Đại lý phân phối gas các quận tại cửa hàng gas Khánh Vân - Gas quận 7'
        />
        <meta
          property='og:description'
          content='Cửa hàng Gas tại TP.HCM cùng đội ngũ chuyên nghiệp. Cửa hàng Gas Quận 7 Giá Rẻ, Uy Tín và Chất Lượng.Chúng tôi cung cấp dịch vụ giao Gas Khánh Vân và lắp đặt miễn phí. Các phụ kiện về Gas gọi là có.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://gaskhanhvanquan7.vercel.app/' />
        <meta
          property='og:image'
          content='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV6JUe_TejYzBFTSUEVdiHsHzVqWOLE1fGXg&s'
        />
      </Head>
      <HomeLayout>
        <LoadingOverlay spinning={loading} />
        {!loading && (
          <>
            <PromotionCarousel />
            <div className={styles.top_bg}>
              <Incentives />

              <Flex justify='center' align='center'>
                <Title level={2} className={styles.title}>
                  SẢN PHẨM
                </Title>
                <div className={styles.border}></div>
              </Flex>

              <ProductSection isFeatured title='Khuyến mãi hôm nay' />

              {categories.map((cat: any) =>
                cat.children && cat.children.length > 0 ? (
                  cat.children.map((child: Category) => (
                    <ProductSection
                      key={`cat-${child.id}`}
                      title={child.name}
                      categoryId={child.id}
                    />
                  ))
                ) : (
                  <ProductSection key={`cat-${cat.id}`} title={cat.name} categoryId={cat.id} />
                )
              )}

              {brands.map((brand: any) => (
                <ProductSection key={`brand-${brand.id}`} title={brand.name} brandId={brand.id} />
              ))}

              <SaleBanner />
            </div>
          </>
        )}
      </HomeLayout>
    </>
  )
}
