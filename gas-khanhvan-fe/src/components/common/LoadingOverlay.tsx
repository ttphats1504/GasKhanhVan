import {Image} from 'antd'
import React from 'react'

type LoadingOverlayProps = {
  spinning: boolean
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({spinning}) => {
  if (!spinning) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        flexDirection: 'column',
        color: '#fff',
      }}
    >
      {/* GIF spinner */}
      <Image
        preview={false}
        src='/loading.gif'
        alt='loading...'
        style={{width: 150, height: 150}}
      />

      {/* Chữ GAS KHÁNH VÂN với animation */}
      <p
        style={{
          marginTop: 5,
          fontSize: 22,
          fontWeight: 'bold',
          color: '#FFD700', // vàng
          animation: 'bounce 1.2s infinite ease-in-out',
        }}
      >
        GAS KHÁNH VÂN
      </p>

      <p style={{marginTop: 16}}>Đang tải dữ liệu...</p>

      {/* Keyframes nhúng trực tiếp */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
        `}
      </style>
    </div>
  )
}

export default LoadingOverlay
