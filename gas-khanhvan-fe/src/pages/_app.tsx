import '@/styles/globals.css'
import 'antd/dist/reset.css' // với Antd v5
import type {AppProps} from 'next/app'
import {Roboto} from 'next/font/google'
import {DefaultSeo} from 'next-seo'
import {ConfigProvider} from 'antd'
import {StyleProvider} from '@ant-design/cssinjs'

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
            <Component {...pageProps} />
          </main>
        </ConfigProvider>
      </StyleProvider>
    </>
  )
}
