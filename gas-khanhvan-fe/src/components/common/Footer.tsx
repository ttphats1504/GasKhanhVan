import {Col, Flex, Row, Typography} from 'antd'
import styles from '../../styles/common/Footer.module.scss'

const {Title} = Typography

const Footer = () => {
  return (
    <>
      <footer className={styles.footer_container}>
        <Row gutter={[16, 16]}>
          {/* Logo + mô tả */}
          <Col xs={24} md={8}>
            <Flex vertical>
              <div className={styles.logo}>LOGO</div>
              <div className={styles.description}>
                Gas Khánh Vân là đại lý gas uy tín tại Quận 7, chuyên cung cấp bình gas chính hãng,
                giao hàng nhanh chóng, an toàn và giá cả hợp lý. Chúng tôi cam kết mang đến dịch vụ
                tốt nhất cho khách hàng tại Quận 7 và các khu vực lân cận.
              </div>
            </Flex>
          </Col>

          {/* Menu cột */}
          <Col xs={24} md={16}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} md={6}>
                <Title level={5}>VỀ CHÚNG TÔI</Title>
                <ul className={styles.menu_list}>
                  <li>Giới thiệu Gas Khánh Vân</li>
                  <li>Dịch vụ giao gas Quận 7</li>
                  <li>Cam kết an toàn</li>
                  <li>Khách hàng tiêu biểu</li>
                </ul>
              </Col>

              <Col xs={12} sm={12} md={6}>
                <Title level={5}>CÁC CHÍNH SÁCH</Title>
                <ul className={styles.menu_list}>
                  <li>Chính sách giao hàng</li>
                  <li>Chính sách bảo hành</li>
                  <li>Chính sách đổi trả</li>
                  <li>Bảo mật thông tin</li>
                  <li>Miễn phí giao gas quận 7</li>
                </ul>
              </Col>

              <Col xs={12} sm={12} md={6}>
                <Title level={5}>DANH MỤC SẢN PHẨM</Title>
                <ul className={styles.menu_list}>
                  <li>Bình gas gia đình</li>
                  <li>Bình gas công nghiệp</li>
                  <li>Phụ kiện gas</li>
                  <li>Dịch vụ lắp đặt</li>
                  <li>Giao gas quận 7</li>
                </ul>
              </Col>

              <Col xs={12} sm={12} md={6}>
                <Title level={5}>THÔNG TIN LIÊN HỆ</Title>
                <ul className={styles.menu_list}>
                  <li>Đại lý Gas Khánh Vân - Gas Quận 7</li>
                  <li>Địa chỉ: 487/2c Đ. Võ Thị Nhờ, Tân Thuận Đông, Quận 7, Hồ Chí Minh</li>
                  <li>
                    Hotline:{' '}
                    <a href='tel:02837731612' style={{color: '#000', fontWeight: 'bold'}}>
                      028 3773 1612
                    </a>
                    <b style={{margin: '0 6px', color: '#000'}}>-</b>
                    <a href='tel:02837731966' style={{color: '#000', fontWeight: 'bold'}}>
                      028 3773 1966
                    </a>
                  </li>
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
