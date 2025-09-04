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
              <div className={styles.logo}>LOGO</div>
              <div className={styles.description}>
                Gas Khánh Vân là đại lý gas uy tín tại Quận 7, chuyên cung cấp bình gas chính hãng,
                giao hàng nhanh chóng, an toàn và giá cả hợp lý. Chúng tôi cam kết mang đến dịch vụ
                tốt nhất cho khách hàng tại Quận 7 và các khu vực lân cận.
              </div>
            </Flex>
          </Col>
          <Col span={16}>
            <Row>
              <Col span={6}>
                <Title level={5}>VỀ CHÚNG TÔI</Title>
                <ul className={styles.menu_list}>
                  <li>Giới thiệu Gas Khánh Vân</li>
                  <li>Dịch vụ giao gas Quận 7</li>
                  <li>Cam kết an toàn</li>
                  <li>Khách hàng tiêu biểu</li>
                </ul>
              </Col>
              <Col span={6}>
                <Title level={5}>CÁC CHÍNH SÁCH</Title>
                <ul className={styles.menu_list}>
                  <li>Chính sách giao hàng</li>
                  <li>Chính sách bảo hành</li>
                  <li>Chính sách đổi trả</li>
                  <li>Bảo mật thông tin</li>
                </ul>
              </Col>
              <Col span={6}>
                <Title level={5}>DANH MỤC SẢN PHẨM</Title>
                <ul className={styles.menu_list}>
                  <li>Bình gas gia đình</li>
                  <li>Bình gas công nghiệp</li>
                  <li>Phụ kiện gas</li>
                  <li>Dịch vụ lắp đặt</li>
                </ul>
              </Col>
              <Col span={6}>
                <Title level={5}>THÔNG TIN LIÊN HỆ</Title>
                <ul className={styles.menu_list}>
                  <li>Đại lý Gas Khánh Vân - Quận 7</li>
                  <li>Địa chỉ: 123 Đường Nguyễn Thị Thập, Quận 7, TP.HCM</li>
                  <li>Hotline: 0909 xxx xxx</li>
                  <li>Email: lienhe@gaskhanhvan.vn</li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </footer>
      <div className={styles.footer_mark}>
        © {`${new Date().getFullYear()}`} Gas Khánh Vân - Đại lý Gas Quận 7, Cửa hàng Gas Quận 7.
        Giao gas tận nơi nhanh chóng và uy tín. All Rights Reserved.
      </div>
    </>
  )
}

export default Footer
