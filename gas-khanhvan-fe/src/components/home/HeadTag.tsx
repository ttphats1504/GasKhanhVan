import * as React from "react";
import { GiftOutlined, TruckOutlined, PhoneOutlined } from "@ant-design/icons";
import styles from "../../styles/home/HeadTag.module.scss";

export default function HeadTag() {
  const announcements = [
    { icon: <TruckOutlined />, text: "Miễn phí giao hàng trong bán kính 5km" },
    { icon: <GiftOutlined />, text: "Giảm giá 10% cho đơn hàng đầu tiên" },
    { icon: <PhoneOutlined />, text: "Hotline: 028 3773 1612 - Tư vấn 24/7" },
  ];

  return (
    <div className={styles.background}>
      <div className={styles.marquee}>
        <div className={styles.marquee_content}>
          {announcements.map((item, index) => (
            <span key={index} className={styles.marquee_item}>
              {item.icon}
              <span>{item.text}</span>
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {announcements.map((item, index) => (
            <span key={`dup-${index}`} className={styles.marquee_item}>
              {item.icon}
              <span>{item.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
