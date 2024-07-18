import Navbar from '@/components/common/Navbar'
import HeadTag from '../components/home/HeadTag'
import React from 'react'
import PromotionCarousel from '@/components/common/PromotionCarousel'
import Incentives from '@/components/common/IncentivesSection'
import Footer from '@/components/common/Footer'

import styles from '../styles/home/Home.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <HeadTag />
      <Navbar />
      <PromotionCarousel />
      <Incentives />
      <Footer />
    </div>
  )
}
