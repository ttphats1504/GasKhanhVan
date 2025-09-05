import React, {useEffect, useState} from 'react'
import {Flex, Image, Spin, message} from 'antd'
import Container from './Container'
import styles from '../../styles/common/Incentives.module.scss'
import handleAPI from '../../apis/handleAPI'
import Incentive from '../../models/Incentive'

const Incentives = () => {
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchIncentives = async () => {
      setLoading(true)
      try {
        const data: any = await handleAPI('/api/incentives', 'get')
        if (data && data.length > 0) {
          const sortedData = data.sort((a: any, b: any) => a.order - b.order)
          setIncentives(sortedData)
        }
      } catch (error) {
        message.error('Không thể tải ưu đãi')
      } finally {
        setLoading(false)
      }
    }

    fetchIncentives()
  }, [])

  return (
    <div className={styles.background}>
      <Container>
        {loading ? (
          <Flex align='center' justify='center' style={{minHeight: 200}}>
            <Spin size='large' />
          </Flex>
        ) : (
          <div className={styles.grid}>
            {incentives.map((item) => (
              <Flex key={item.id} vertical align='center' justify='center' className={styles.item}>
                <Image
                  src={item.image}
                  alt={item.name}
                  preview={false}
                  width={80}
                  height={80}
                  style={{objectFit: 'contain'}}
                />
                <span className={styles.name}>{item.name}</span>
              </Flex>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

export default Incentives
