export interface Cylinder {
  id: string
  name: string
  type: string
  price: number
  stock: number
  image: string
  description: string
  createdAt: string
}

const cylinders: Cylinder[] = [
  {
    id: '1',
    name: 'Oxygen Cylinder 10L',
    type: 'Medical',
    price: 150.0,
    stock: 20,
    image: '/assets/gas/xanh-petrolimex.png',
    description:
      'A high-quality medical-grade oxygen cylinder with a 10L capacity, suitable for hospitals and emergency use.',
    createdAt: '2025-02-08T10:00:00Z',
  },
  {
    id: '2',
    name: 'CO2 Cylinder 5kg',
    type: 'Industrial',
    price: 80.0,
    stock: 15,
    image: '/assets/gas/xanh-petrolimex.png',
    description:
      'Carbon dioxide cylinder for industrial use, including welding and beverage carbonation.',
    createdAt: '2025-02-07T12:30:00Z',
  },
  {
    id: '3',
    name: 'Nitrogen Cylinder 50L',
    type: 'Industrial',
    price: 250.0,
    stock: 10,
    image: '/assets/gas/xanh-petrolimex.png',
    description:
      'Large-capacity nitrogen gas cylinder, perfect for food packaging and chemical applications.',
    createdAt: '2025-02-06T14:20:00Z',
  },
  {
    id: '4',
    name: 'Argon Gas Cylinder 40L',
    type: 'Welding',
    price: 220.0,
    stock: 5,
    image: '/assets/gas/xanh-petrolimex.png',
    description:
      'High-purity argon gas cylinder used in TIG welding and metal fabrication industries.',
    createdAt: '2025-02-05T08:10:00Z',
  },
  {
    id: '5',
    name: 'Argon Gas Cylinder 40L',
    type: 'Welding',
    price: 220.0,
    stock: 5,
    image: '/assets/gas/xanh-petrolimex.png',
    description:
      'High-purity argon gas cylinder used in TIG welding and metal fabrication industries.',
    createdAt: '2025-02-05T08:10:00Z',
  },
  {
    id: '6',
    name: 'Argon Gas Cylinder 40L',
    type: 'Welding',
    price: 220.0,
    stock: 5,
    image: '/assets/gas/xanh-petrolimex.png',
    description:
      'High-purity argon gas cylinder used in TIG welding and metal fabrication industries.',
    createdAt: '2025-02-05T08:10:00Z',
  },
  {
    id: '7',
    name: 'Argon Gas Cylinder 40L',
    type: 'Welding',
    price: 220.0,
    stock: 5,
    image: '/assets/gas/xanh-petrolimex.png',
    description:
      'High-purity argon gas cylinder used in TIG welding and metal fabrication industries.',
    createdAt: '2025-02-05T08:10:00Z',
  },
  {
    id: '8',
    name: 'Argon Gas Cylinder 40L',
    type: 'Welding',
    price: 220.0,
    stock: 5,
    image: '/assets/gas/xanh-petrolimex.png',
    description:
      'High-purity argon gas cylinder used in TIG welding and metal fabrication industries.',
    createdAt: '2025-02-05T08:10:00Z',
  },
]

export default cylinders
