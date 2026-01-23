import "@/styles/globals.css";
import "antd/dist/reset.css"; // với Antd v5
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { DefaultSeo } from "next-seo";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import FloatButtons from "@/components/common/FloatButtons";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect } from "react";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Disable browser scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top IMMEDIATELY when route changes using useLayoutEffect
  useLayoutEffect(() => {
    // Force scroll multiple times to override any interference
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also scroll after a tiny delay to catch late interference
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);

    return () => clearTimeout(timer);
  }, [router.asPath]);

  return (
    <>
      <DefaultSeo
        title="Đại lý phân phối gas các quận tại cửa hàng gas Khánh Vân - Đại lý Gas Quận 7, Gas Quận 7 Uy Tín Và Chất Lượng"
        description="Cửa hàng Gas, Đại lý Gas Quận 7 tại TP.HCM cùng đội ngũ chuyên nghiệp. Gas Quận 7 Giá Rẻ, Uy Tín Và Chất Lượng. Chúng tôi cung cấp dịch vụ giao Gas Khánh Vân và lắp đặt miễn phí. Các phụ kiện về Gas gọi là có."
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: "https://gaskhanhvanquan7.vercel.app/",
          siteName: "Cửa Hàng Gas Khánh Vân - Đại lý Gas Quận 7, Gas Quận 7",
        }}
      />
      <StyleProvider hashPriority="high">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#F14A00",
            },
          }}
        >
          <main className={roboto.className}>
            <FloatButtons />
            <Component {...pageProps} />
          </main>
        </ConfigProvider>
      </StyleProvider>
    </>
  );
}
