import React, {useEffect, useState} from 'react'
import {Flex, Image, Spin, message} from 'antd'
import Container from './Container'
import styles from '../../styles/common/Incentives.module.scss'
import handleAPI from '../../apis/handleAPI'
import Incentive from '../../models/Incentive' // assuming it has id, name, image

const Incentives = () => {
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchIncentives = async () => {
      setLoading(true)
      try {
        const data: any = await handleAPI('/api/incentives', 'get')
        setIncentives(data)
      } catch (error) {
        message.error('Failed to load incentives')
      } finally {
        setLoading(false)
      }
    }

    fetchIncentives()
  }, [])

  return (
    <div className={styles.background}>
      <Container>
        <div className={styles.wrap}>
          {loading ? (
            <Spin size='large' />
          ) : (
            incentives.map((item) => (
              <Flex
                key={item.id}
                gap='middle'
                vertical
                align='center'
                justify='center'
                className={styles.item}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  preview={false}
                  width={80}
                  style={{objectFit: 'contain'}}
                />
                <span>{item.name}</span>
              </Flex>
            ))
          )}
        </div>
      </Container>
    </div>
  )
}

export default Incentives
