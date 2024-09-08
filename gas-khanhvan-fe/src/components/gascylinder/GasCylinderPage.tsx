import { Carousel, Col, Image, Row } from "antd";

import styles from "@/styles/gascylinder/GasCylinderPage.module.scss";
import FilterSideBar from "../common/FilterSidebar";

const GasCylinderPage = () => {
  return (
    <div className={styles.wrapper}>
      <Carousel autoplay className={styles.carousel}>
        <div>
          <h3 className={styles.carousel_item}>1</h3>
        </div>
        <div>
          <h3 className={styles.carousel_item}>2</h3>
        </div>
        <div>
          <h3 className={styles.carousel_item}>3</h3>
        </div>
        <div>
          <h3 className={styles.carousel_item}>4</h3>
        </div>
      </Carousel>
      <div>
        <Row>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src="/assets/partners/petro-gas.png"
              alt="Petro Gas Image"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src="/assets/partners/petro-gas.png"
              alt="Petro Gas Image"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src="/assets/partners/petro-gas.png"
              alt="Petro Gas Image"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src="/assets/partners/petro-gas.png"
              alt="Petro Gas Image"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src="/assets/partners/petro-gas.png"
              alt="Petro Gas Image"
              preview={false}
            />
          </Col>
          <Col span={4}>
            <Image
              className={styles.partner_image}
              src="/assets/partners/petro-gas.png"
              alt="Petro Gas Image"
              preview={false}
            />
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={32}>
          <Col span={6}>
            <FilterSideBar />
          </Col>
          <Col span={18}>GasCylinderPage</Col>
        </Row>
      </div>
    </div>
  );
};

export default GasCylinderPage;
