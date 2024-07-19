import Navbar from '@/components/common/Navbar'
import HeadTag from '../components/home/HeadTag'
import React from 'react'
import PromotionCarousel from '@/components/common/PromotionCarousel'
import Incentives from '@/components/common/IncentivesSection'
import Footer from '@/components/common/Footer'

import styles from '../styles/home/Home.module.scss'
import ProductSection from '@/components/home/ProductSection'

export default function Home() {
  return (
    <div className={styles.container}>
      <HeadTag />
      <Navbar />
      <PromotionCarousel />
      <main>
        <div className={styles.top_bg}>
          <Incentives />
          <ProductSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
