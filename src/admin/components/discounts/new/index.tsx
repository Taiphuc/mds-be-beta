import DiscountForm from "./discount-form"
import { DiscountFormProvider } from "./discount-form/form/discount-form-context"

const NewDiscount = () => {
  return (
    <div className="pb-xlarge">
      <DiscountFormProvider>
        <DiscountForm />
      </DiscountFormProvider>
    </div>
  )
}

export default NewDiscount
