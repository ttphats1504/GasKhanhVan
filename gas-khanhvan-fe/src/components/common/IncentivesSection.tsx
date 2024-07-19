import {Flex, Image} from 'antd'
import Container from './Container'
import styles from '../../styles/common/Incentives.module.scss'

const Incentives = () => {
  return (
    <div className={styles.background}>
      <Container>
        <div className={styles.wrap}>
          <Flex gap='middle' vertical align='center' justify='center' className={styles.item}>
            <Image src='/assets/incentives/gas-to-home.png' alt='abc' preview={false} width={80} />
            <span>Giao hàng nhanh chóng</span>
          </Flex>
          <Flex gap='middle' vertical align='center' justify='center' className={styles.item}>
            <Image src='/assets/incentives/24h.png' alt='abc' preview={false} width={80} />
            <span>Hỗ trợ 24/7</span>
          </Flex>
          <Flex gap='middle' vertical align='center' justify='center' className={styles.item}>
            <Image src='/assets/incentives/quality.png' alt='abc' preview={false} width={80} />
            <span>Đảm bảo uy tín chất lượng</span>
          </Flex>
          <Flex gap='middle' vertical align='center' justify='center' className={styles.item}>
            <Image src='/assets/incentives/revert.png' alt='abc' preview={false} width={80} />
            <span>Đổi trả dễ dàng</span>
          </Flex>
        </div>
      </Container>
    </div>
  )
}

export default Incentives
