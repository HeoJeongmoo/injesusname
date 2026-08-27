// src/pages/ProductDetail.tsx
import { useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { id } = useParams()
  return <div>Product {id}</div>
}