import Navbar from '@/components/common/Navbar'
import HeadTag from '../components/home/HeadTag'
import React from 'react'
import PromotionCarousel from '@/components/common/PromotionCarousel'
import Incentives from '@/components/common/IncentivesSection'
import Footer from '@/components/common/Footer'

import styles from '../styles/home/Home.module.scss'
import ProductSection from '@/components/home/ProductSection'
import Head from 'next/head'
import SaleBanner from '@/components/common/SaleBanner'
import MainLayout from '@/layouts/MainLayout'
import HomeLayout from '@/layouts/HomeLayout'

export default function Home() {
  return (
    <>
      <Head>
        <title>Cửa Hàng Gas Khánh Vân - Gas Quận 7 Uy Tín Và Chất Lượng</title>
        <meta
          name='google-site-verification'
          content='fGBYkhFdJUL3GIjICrtondPt09jdkdNqVVpDK1hoW6Y'
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
            <ProductSection />
            <SaleBanner />
          </div>
        </div>
        <Footer />
      </HomeLayout>
    </>
  )
}
