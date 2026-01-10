'use client';

import { useState } from 'react';
import { PhoneOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton, Image } from 'antd';
import styles from '../../styles/common/FloatButtons.module.scss';

const FloatButtons = () => {
  const [showPhone, setShowPhone] = useState(false);

  return (
    <>
      {/* Custom Float Button Group */}
      <div className={styles.floatButtonGroup}>
        {/* Call Button with Phone Number Hover */}
        <div 
          className={styles.floatButtonWrapper}
          onMouseEnter={() => setShowPhone(true)}
          onMouseLeave={() => setShowPhone(false)}
        >
          <a href="tel:02837731612" className={styles.floatButton}>
            <div className={`${styles.callBtn} ${styles.btnCircle}`}>
              <PhoneOutlined className={styles.icon} />
            </div>
          </a>
          <div className={`${styles.phoneNumber} ${showPhone ? styles.show : ''}`}>
            <span className={styles.phoneText}>028 3773 1612</span>
          </div>
        </div>

        {/* Zalo Button */}
        <div className={styles.floatButtonWrapper}>
          <a 
            href="https://zalo.me/0937762979" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.floatButton}
          >
            <div className={`${styles.zaloBtn} ${styles.btnCircle}`}>
              <Image
                src="/assets/zalo.png"
                alt="Zalo"
                width={24}
                height={24}
                preview={false}
                className={styles.iconImg}
              />
            </div>
          </a>
          <div className={styles.tooltip}>Chat Zalo</div>
        </div>

        {/* Messenger Button */}
        <div className={styles.floatButtonWrapper}>
          <a 
            href="https://m.me/khanhvangas" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.floatButton}
          >
            <div className={`${styles.messBtn} ${styles.btnCircle}`}>
              <Image
                src="/assets/messenger.png"
                alt="Messenger"
                width={24}
                height={24}
                preview={false}
                className={styles.iconImg}
              />
            </div>
          </a>
          <div className={styles.tooltip}>Messenger</div>
        </div>
      </div>

      {/* Back to Top Button */}
      <FloatButton.BackTop
        visibilityHeight={200}
        target={() => document.body}
        className={styles.backTopBtn}
        style={{ right: 24, bottom: 80 }}
      >
        <div className={styles.backTopInner}>
          <ArrowUpOutlined />
        </div>
      </FloatButton.BackTop>
    </>
  );
};

export default FloatButtons;

