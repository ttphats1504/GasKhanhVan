import '@/styles/globals.css'
import 'antd/dist/reset.css' // với Antd v5
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import type {AppProps} from 'next/app'
import {Roboto} from 'next/font/google'
import {DefaultSeo} from 'next-seo'
import {ConfigProvider, Image} from 'antd'
import {StyleProvider} from '@ant-design/cssinjs'
import {BackTop, FloatButton} from 'antd'
import {PhoneOutlined, MessageOutlined, CustomerServiceOutlined} from '@ant-design/icons'
import styles from '../styles/home/Home.module.scss'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <DefaultSeo
        title='Đại lý phân phối gas các quận tại cửa hàng gas Khánh Vân - Đại lý Gas Quận 7, Gas Quận 7 Uy Tín Và Chất Lượng'
        description='Cửa hàng Gas, Đại lý Gas Quận 7 tại TP.HCM cùng đội ngũ chuyên nghiệp. Gas Quận 7 Giá Rẻ, Uy Tín Và Chất Lượng. Chúng tôi cung cấp dịch vụ giao Gas Khánh Vân và lắp đặt miễn phí. Các phụ kiện về Gas gọi là có.'
        openGraph={{
          type: 'website',
          locale: 'vi_VN',
          url: 'https://gaskhanhvanquan7.vercel.app/',
          siteName: 'Cửa Hàng Gas Khánh Vân - Đại lý Gas Quận 7, Gas Quận 7',
        }}
      />
      <StyleProvider hashPriority='high'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#F14A00',
            },
          }}
        >
          <main className={roboto.className}>
            <FloatButton.Group shape='circle' className={styles.fabGroup}>
              {/* Call */}
              <FloatButton
                icon={<PhoneOutlined />}
                onClick={() => (window.location.href = 'tel:0938183330')}
                tooltip='Gọi ngay'
                className={styles.callBtn}
              >
                <span className={styles.callNumber}>0938 183 330</span>
              </FloatButton>

              {/* Zalo with PNG logo */}
              <FloatButton
                icon={
                  <Image
                    src='/assets/zalo.png'
                    alt='Zalo'
                    width={20}
                    height={20}
                    preview={false}
                    className={styles.iconFix}
                  />
                }
                onClick={() => window.open('https://zalo.me/0938183330', '_blank')}
                tooltip='Chat Zalo'
                className={styles.zaloBtn}
              />

              {/* Messenger */}
              <FloatButton
                icon={
                  <Image
                    src='/assets/messenger.png'
                    alt='Messenger'
                    width={20}
                    height={20}
                    preview={false}
                    className={styles.iconFix}
                  />
                }
                onClick={() => window.open('https://m.me/khanhvangas', '_blank')}
                tooltip='Messenger'
                className={styles.messBtn}
              />

              <FloatButton.BackTop visibilityHeight={200} />
            </FloatButton.Group>
            <Component {...pageProps} />
          </main>
        </ConfigProvider>
      </StyleProvider>
    </>
  )
}
