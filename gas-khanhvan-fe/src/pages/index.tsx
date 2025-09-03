import React, {useEffect, useState} from 'react'
import PromotionCarousel from '@/components/common/PromotionCarousel'
import Incentives from '@/components/common/IncentivesSection'
import Footer from '@/components/common/Footer'

import styles from '../styles/home/Home.module.scss'
import ProductSection from '@/components/home/ProductSection'
import Head from 'next/head'
import SaleBanner from '@/components/common/SaleBanner'
import HomeLayout from '@/layouts/HomeLayout'
import handleAPI from '@/apis/handleAPI'
import Category from '@/models/Category'
import {Flex, Typography} from 'antd'
import Brand from '@/models/Brand'

const {Title} = Typography

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch categories
        const categoryRes: any = await handleAPI('/api/categories', 'get')
        const filteredCategory = categoryRes.filter((cat: any) => cat.slug !== 'san-pham')
        setCategories(filteredCategory)

        // fetch brands
        const brandRes: any = await handleAPI('/api/brands', 'get')
        setBrands(brandRes.data || [])
      } catch (err) {
        console.error(err)
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
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: 'https://gaskhanhvanquan7.vercel.app/',
              name: 'Cửa Hàng Gas Gas Quận 7 - Gas Khánh Vân',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://gaskhanhvanquan7.vercel.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>
      <HomeLayout>
        <PromotionCarousel />
        <div>
          <div className={styles.top_bg}>
            <Incentives />
            <Flex justify='center' align='center'>
              <Title level={2} className={styles.title}>
                SẢN PHẨM
              </Title>
              <div className={styles.border}></div>
            </Flex>

            {/* Featured Products */}
            <ProductSection isFeatured title='Khuyến mãi hôm nay' />

            {/* Products by Category */}
            {categories.map((cat: any) =>
              cat.children && cat.children.length > 0 ? (
                // Render children categories
                cat.children.map((child: Category) => (
                  <ProductSection
                    key={`cat-${child.id}`}
                    title={child.name}
                    categoryId={child.id}
                  />
                ))
              ) : (
                // Render parent if no children
                <ProductSection key={`cat-${cat.id}`} title={cat.name} categoryId={cat.id} />
              )
            )}

            {/* Products by Brand */}
            {brands.map((brand) => (
              <ProductSection key={`brand-${brand.id}`} title={brand.name} brandId={brand.id} />
            ))}

            <SaleBanner />
          </div>
        </div>
        <Footer />
      </HomeLayout>
    </>
  )
}
