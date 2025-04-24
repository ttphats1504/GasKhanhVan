'use client'

import React from 'react'
import Link from 'next/link'
import {Breadcrumb} from 'antd'

export type CustomBreadcrumbItem = {
  label: string
  href?: string
}

type CustomBreadcrumbsProps = {
  items: CustomBreadcrumbItem[]
  style?: React.CSSProperties
}

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({items, style}) => {
  return (
    <Breadcrumb style={{padding: '10px 50px', ...style}}>
      {items.map((item, index) =>
        item.href ? (
          <Breadcrumb.Item key={index}>
            <Link href={item.href}>{item.href}</Link>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={index}>{item.href}</Breadcrumb.Item>
        )
      )}
    </Breadcrumb>
  )
}

export default CustomBreadcrumbs
