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
  console.log(items)
  return (
    <Breadcrumb style={{...style}}>
      {items.map((item, index) =>
        item.href ? (
          <Breadcrumb.Item key={index}>
            <Link href={item.href}>{item.label}</Link>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={index}>{item.label}</Breadcrumb.Item>
        )
      )}
    </Breadcrumb>
  )
}

export default CustomBreadcrumbs
