import {Col, Row, Typography, Space, Button} from 'antd'
import {PhoneOutlined, MailOutlined, EnvironmentOutlined} from '@ant-design/icons'
import styles from '@/styles/home/Home.module.scss'

const {Title, Text} = Typography

export default function ContactSection() {
  return (
    <div className={styles.contact_section}>
      <Row gutter={[32, 32]} align='middle'>
        {/* Thông tin liên hệ */}
        <Col xs={24} md={12}>
          <Title level={2}>Liên hệ với Gas Khánh Vân</Title>
          <Space direction='vertical' size='middle'>
            <Text>
              <PhoneOutlined /> Hotline: <b style={{color: '#d4380d'}}>0909 123 456</b>
            </Text>
            <Text>
              <MailOutlined /> Email: gaskhanhvan@gmail.com
            </Text>
            <Text>
              <EnvironmentOutlined /> Địa chỉ: 487/2c Đ. Võ Thị Nhờ, Tân Thuận Đông, Quận 7, Hồ Chí
              Minh
            </Text>
            <Button
              type='primary'
              size='large'
              href='tel:0909123456'
              style={{background: '#ff4d4f', border: 'none'}}
            >
              Gọi ngay
            </Button>
          </Space>
        </Col>

        {/* Google Map */}
        <Col xs={24} md={12}>
          <div className={styles.map_wrapper}>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.8619646968436!2d106.7303888538547!3d10.74512011996998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175258216eb77d9%3A0x8c752bc8b51d822d!2zNDg3LzJjIMSQLiBWw7UgVGjhu4sgTmjhu50sIFTDom4gVGh14bqtbiDEkMO0bmcsIFF14bqtbiA3LCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1757517009817!5m2!1svi!2s'
              width='100%'
              height='300'
              style={{border: 0, borderRadius: '12px'}}
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
        </Col>
      </Row>
    </div>
  )
}
