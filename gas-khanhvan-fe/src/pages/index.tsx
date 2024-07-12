import Navbar from '@/components/common/Navbar'
import HeadTag from '../components/home/HeadTag'
import React, {useState} from 'react'
import PromotionCarousel from '@/components/common/PromotionCarousel'

import styles from '../styles/home/Home.module.scss'
import Incentives from '@/components/common/IncentivesSection'

export default function Home() {
  return (
    <div className={styles.container}>
      <HeadTag />
      <Navbar />
      <PromotionCarousel />
      <Incentives />
    </div>
  )
}
