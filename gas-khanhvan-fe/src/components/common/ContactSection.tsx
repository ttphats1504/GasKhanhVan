import { Col, Row, Typography, Space, Button, Card } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import styles from "@/styles/home/Home.module.scss";

const { Title, Text, Paragraph } = Typography;

export default function ContactSection() {
  return (
    <div className={styles.contact_section}>
      {/* 🎨 Floating icons decoration */}
      <div className={styles.floating_icons}>
        <PhoneOutlined className={styles.float_icon_1} />
        <MailOutlined className={styles.float_icon_2} />
        <EnvironmentOutlined className={styles.float_icon_3} />
      </div>

      <div className={styles.contact_header}>
        <Title level={2}>LIÊN HỆ VỚI CHÚNG TÔI</Title>
        <Paragraph>Phục vụ tận tâm 24/7 - Giao hàng nhanh chóng</Paragraph>
      </div>

      <Row gutter={[32, 32]}>
        {/* Thông tin liên hệ - Cards */}
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            {/* Hotline Card */}
            <Col xs={24} sm={12} style={{ display: "flex" }}>
              <Card
                className={styles.contact_card}
                hoverable
                style={{ width: "100%" }}
              >
                <div className={styles.contact_card_content}>
                  <PhoneOutlined className={styles.contact_icon} />
                  <div style={{ flex: 1 }}>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontSize: "15px",
                      }}
                    >
                      Số Điện Thoại
                    </Text>
                    <a
                      href="tel:02837731612"
                      className={styles.contact_link}
                      style={{ display: "block", marginBottom: 4 }}
                    >
                      028 3773 1612
                    </a>
                    <a
                      href="tel:02837731966"
                      className={styles.contact_link}
                      style={{ display: "block" }}
                    >
                      028 3773 1966
                    </a>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Email Card */}
            <Col xs={24} sm={12} style={{ display: "flex" }}>
              <Card
                className={styles.contact_card}
                hoverable
                style={{ width: "100%" }}
              >
                <div className={styles.contact_card_content}>
                  <MailOutlined className={styles.contact_icon} />
                  <div style={{ flex: 1 }}>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontSize: "15px",
                      }}
                    >
                      Email Liên Hệ
                    </Text>
                    <a
                      href="mailto:gaskhanhvan@gmail.com"
                      className={styles.contact_link}
                    >
                      gaskhanhvan@gmail.com
                    </a>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Địa chỉ Card */}
            <Col xs={24} sm={12} style={{ display: "flex" }}>
              <Card
                className={styles.contact_card}
                hoverable
                style={{ width: "100%" }}
              >
                <div className={styles.contact_card_content}>
                  <EnvironmentOutlined className={styles.contact_icon} />
                  <div style={{ flex: 1 }}>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontSize: "15px",
                      }}
                    >
                      Địa Chỉ Cửa Hàng
                    </Text>
                    <Text
                      style={{
                        fontSize: "15px",
                        color: "#595959",
                        lineHeight: 1.6,
                      }}
                    >
                      487/2c Đ. Võ Thị Nhờ, Tân Thuận Đông, Quận 7, TP.HCM
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Giờ làm việc Card */}
            <Col xs={24} sm={12} style={{ display: "flex" }}>
              <Card
                className={styles.contact_card}
                hoverable
                style={{ width: "100%" }}
              >
                <div className={styles.contact_card_content}>
                  <ClockCircleOutlined className={styles.contact_icon} />
                  <div style={{ flex: 1 }}>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontSize: "15px",
                      }}
                    >
                      Thời Gian Phục Vụ
                    </Text>
                    <Text style={{ fontSize: "15px", color: "#595959" }}>
                      Mở cửa 24/7 - Kể cả ngày lễ, Tết
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>

            {/* CTA Button */}
            <Col xs={24}>
              <Button
                type="primary"
                size="large"
                icon={<PhoneOutlined />}
                href="tel:02837731612"
                block
                className={styles.contact_cta}
              >
                Gọi Ngay Đặt Hàng
              </Button>
            </Col>
          </Row>
        </Col>

        {/* Google Map */}
        <Col xs={24} lg={12}>
          <div className={styles.map_container}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.8619646968436!2d106.7303888538547!3d10.74512011996998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175258216eb77d9%3A0x8c752bc8b51d822d!2zNDg3LzJjIMSQLiBWw7UgVGjhu4sgTmjhu50sIFTDom4gVGh14bqtbiDEkMO0bmcsIFF14bqtbiA3LCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1757517009817!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Col>
      </Row>
    </div>
  );
}
