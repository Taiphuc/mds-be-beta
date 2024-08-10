import { Product, ProductOption } from "@medusajs/medusa"
import { useAdminProducts } from "medusa-react"
import React, { createContext, useContext, useMemo } from "react"

type LinkedProduct = {
  options: ProductOption[] | undefined
  status: "loading" | "success" | "error" | "idle"
  refetch: () => void
}

const LinkedProductType = createContext<LinkedProduct | null>(null)

type Props = {
  product: Product
  children?: React.ReactNode
}

const LinkedProductProvider = ({ product, children }: Props) => {
  const { products, status, refetch } = useAdminProducts({
    id: product.id,
    expand: "options,options.values",
  })

  const options = useMemo(() => {
    if (products && products.length > 0 && status !== "loading") {
      return products[0].options
    } else {
      return undefined
    }
  }, [products, status])

  return (
    <LinkedProductType.Provider value={{ options, status, refetch }}>
      {children}
    </LinkedProductType.Provider>
  )
}

export const useLinkedProduct = () => {
  const context = useContext(LinkedProductType)
  if (!context) {
    throw new Error("useLinkedProduct must be used within a LinkedProductProvider")
  }
  return context
}

export default LinkedProductProvider