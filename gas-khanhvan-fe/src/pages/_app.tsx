import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { DefaultSeo } from "next-seo";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="Đại lý phân phối gas các quận tại cửa hàng gas Khánh Vân - Gas Quận 7 Uy Tín Và Chất Lượng"
        description="Cửa hàng Gas tại TP.HCM cùng đội ngũ chuyên nghiệp. Gas Quận 7 Giá Rẻ, Uy Tín Và Chất Lượng.Chúng tôi cung cấp dịch vụ giao Gas Khánh Vân và lắp đặt miễn phí. Các phụ kiện về Gas gọi là có."
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: "https://gas-khanh-van.vercel.app/",
          siteName: "Cửa Hàng Gas Khánh Vân - Gas Quận 7",
        }}
      />
      <main className={roboto.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
