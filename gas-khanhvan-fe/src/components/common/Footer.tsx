import {Col, Flex, Row} from 'antd'
import {Typography} from 'antd'

import styles from '../../styles/common/Footer.module.scss'

const {Title} = Typography

const Footer = () => {
  return (
    <>
      <footer className={styles.footer_container}>
        <Row>
          <Col span={8}>
            <Flex vertical>
              <div>LOGO</div>
              <div>Description </div>
            </Flex>
          </Col>
          <Col span={16}>
            <Row>
              <Col span={6}>
                <Title level={5}>VỀ CHÚNG TÔI</Title>
                <ul className={styles.menu_list}>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                </ul>
              </Col>
              <Col span={6}>
                <Title level={5}>CÁC CHÍNH SÁCH</Title>
                <ul className={styles.menu_list}>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                </ul>
              </Col>
              <Col span={6}>
                <Title level={5}>DANH MỤC SẢN PHẨM</Title>
                <ul className={styles.menu_list}>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                </ul>
              </Col>
              <Col span={6}>
                <Title level={5}>THÔNG TIN LIÊN HỆ</Title>
                <ul className={styles.menu_list}>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                  <li>Bình Gas</li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </footer>
      <div className={styles.footer_mark}>© 2024 Khánh Vân Gas. All Rights Reserved.</div>
    </>
  )
}

export default Footer
