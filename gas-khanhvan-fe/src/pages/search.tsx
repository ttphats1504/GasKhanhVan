import {AutoComplete, Image, Input} from 'antd'
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import handleAPI from '@/apis/handleAPI'
import styles from '@/styles/common/Navbar.module.scss'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  image: string
  slug: string
  price: number
}

const Navbar = () => {
  const router = useRouter()
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setOptions([])
      return
    }
    setLoading(true)
    try {
      const res: any = await handleAPI(`/api/products?search=${value}`, 'get')
      const products: Product[] = res.data || []
      setOptions(
        products.map((p) => ({
          value: p.slug,
          label: (
            <Link href={`/product/${p.slug}`} className={styles.suggest_item}>
              <Image src={p.image} alt={p.name} className={styles.suggest_img} />
              <div>
                <div className={styles.suggest_name}>{p.name}</div>
                <div className={styles.suggest_price}>{p.price.toLocaleString()}₫</div>
              </div>
            </Link>
          ),
        }))
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onSelect = (slug: string) => {
    router.push(`/product/${slug}`)
  }

  return (
    <div className={styles.navbar_sticky}>
      <div className={styles.wrapper}>
        <div>
          <Link href='/'>Logo</Link>
        </div>

        {/* Your Menu goes here */}

        <div className={styles.search_wrap}>
          <AutoComplete
            style={{width: 300}}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            notFoundContent={loading ? 'Đang tìm...' : 'Không tìm thấy'}
          >
            <Input.Search placeholder='Tìm kiếm sản phẩm...' enterButton />
          </AutoComplete>
        </div>
      </div>
    </div>
  )
}

export default Navbar
