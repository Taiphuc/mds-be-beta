import { RouteProps } from "@medusajs/admin";
import { FC, useState, ChangeEvent, useEffect } from "react";
import {
  formatAmount,
  useUpdateLineItem,
  useDeleteLineItem,
  useAdminCustomQuery,
  useAdminCustomPost,
} from "medusa-react";
import InputField from "../../input";
import Modal from "../../molecules/modal";
import Button from "../button";
import { Cart } from "@medusajs/medusa";
import Medusa from "@medusajs/medusa-js";
import Spacer from "../spacer";
import { Trash } from "@medusajs/icons";

interface EditAbandonedProps extends RouteProps {
  cart: Cart;
  isOpen: boolean;
  open: () => void;
  reload: () => void;
  close: () => void;
}

const EditAbandoned: FC<EditAbandonedProps> = ({ open, reload, isOpen, close, notify, cart }) => {
  const [abandonedCart, setAbandonedCart] = useState<any>();
  const adjustLineItem = useUpdateLineItem(cart?.id!);
  const removeLineItem = useDeleteLineItem(cart?.id!);
  const { data } = useAdminCustomQuery<{ data: Cart }, any>("carts/" + cart?.id, []);
  const { mutate: updateCart } = useAdminCustomPost("carts/" + cart?.id, []);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAbandonedCart({ ...abandonedCart, shipping_address: { ...abandonedCart.shipping_address, [name]: value } });
  };

  const updateItem = ({ lineId, quantity }: { lineId: string; quantity: number }) => {
    adjustLineItem.mutate({
      lineId,
      quantity,
    });
  };

  const onSave = async () => {
    updateCart(
      {
        email: abandonedCart?.email,
        shipping_address: {
          address_1: abandonedCart.shipping_address.address_1,
          address_2: abandonedCart.shipping_address.address2,
          city: abandonedCart.shipping_address.city,
          company: abandonedCart.shipping_address.company,
          country_code: abandonedCart.shipping_address.country_code,
          first_name: abandonedCart.shipping_address.first_name,
          last_name: abandonedCart.shipping_address.last_name,
          phone: abandonedCart.shipping_address.phone,
          postal_code: abandonedCart.shipping_address.postal_code,
          province: abandonedCart.shipping_address.province,
        },
      },
      {
        onSuccess: () => {
          notify.success("update successfully", "Cart updated successfully");
          reload();
          close();
        },
        onError: () => {
          notify.error("Error updating", "Menu updated error");
        },
      }
    );
  };

  const handleUpdateQuantity = (id: string, value: string) => {
    const newAbandonedCart = { ...abandonedCart };
    newAbandonedCart.items = abandonedCart?.items?.map((item) => {
      if (item.id === id) {
        item.quantity = +value;
        item.total = item.unit_price * +value;
      }
      return item;
    });
    setAbandonedCart(newAbandonedCart);
    updateItem({
      lineId: id,
      quantity: parseInt(value),
    });
  };

  const handleDeleteItem = (id: string) => {
    removeLineItem.mutateAsync({ lineId: id });
    const newAbandonedCart = { ...abandonedCart };
    newAbandonedCart.items = abandonedCart?.items?.filter((item) => item.id !== id);
    setAbandonedCart(newAbandonedCart);
  };

  useEffect(() => {
    if (data?.data) {
      setAbandonedCart(data?.data);
    }
  }, [data]);

  return (
    <Modal open={isOpen} handleClose={close}>
      <Modal.Body>
        <Modal.Header handleClose={close}>
          <h1 className="inter-xlarge-semibold m-0">Edit Abandoned Cart</h1>
        </Modal.Header>
        <Modal.Content>
          <div className="w-full grid grid-cols-2 gap-3">
            <InputField
              required
              label="Email"
              type="string"
              name="email"
              value={abandonedCart?.email}
              className="my-6"
              onChange={handleChangeValue}
            />
            <InputField
              required
              label="Phone"
              type="string"
              name="phone"
              className="my-6"
              value={abandonedCart?.shipping_address?.phone}
              onChange={handleChangeValue}
            />
          </div>

          <p>Shipping address</p>
          <div className="w-full grid grid-cols-2 gap-x-3 gap-y-2">
            <InputField
              required
              label="First Name"
              type="string"
              name="first_name"
              value={abandonedCart?.shipping_address?.first_name}
              onChange={handleChangeValue}
              autoFocus
            />
            <InputField
              required
              label="Last Name"
              type="string"
              name="last_name"
              value={abandonedCart?.shipping_address?.last_name}
              onChange={handleChangeValue}
            />
          </div>
          <div className="w-full">
            <InputField
              required
              label="Address"
              type="string"
              name="address_1"
              value={abandonedCart?.shipping_address?.address_1}
              className="my-6"
              onChange={handleChangeValue}
            />
          </div>
          <div className="w-full">
            <InputField
              required
              label="Apartments, suite, etcApartments, suite, etc"
              type="string"
              name="address_2"
              value={abandonedCart?.shipping_address?.address_2}
              className="my-6"
              onChange={handleChangeValue}
            />
          </div>
          <div className="w-full">
            <InputField
              required
              label="Company"
              type="string"
              name="company"
              value={abandonedCart?.shipping_address?.company}
              className="my-6"
              onChange={handleChangeValue}
            />
          </div>
          <div className="w-full">
            <InputField
              required
              label="Town / City"
              type="string"
              name="city"
              value={abandonedCart?.shipping_address?.city}
              className="my-6"
              onChange={handleChangeValue}
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-x-3 gap-y-2">
            <InputField
              required
              label="State / Province"
              type="string"
              name="province"
              value={abandonedCart?.shipping_address?.province}
              onChange={handleChangeValue}
            />
            <InputField
              required
              label="Postcode / Zip"
              type="string"
              name="postal_code"
              value={abandonedCart?.shipping_address?.postal_code}
              onChange={handleChangeValue}
            />
          </div>
          <Spacer />
          <h3>Products </h3>
          <div className="flex flex-col gap-2 py-3">
            {abandonedCart?.items?.map((item: any, i: number) => {
              return (
                <div className="w-full grid grid-cols-6 gap-2" key={item?.id}>
                  <div className="">
                    <img
                      src={item?.variant?.thumbnail || item?.variant?.product?.thumbnail}
                      alt=""
                      className="w-full h-full"
                    />
                  </div>
                  <div className="col-span-4">
                    <p>{item?.variant?.product?.title}</p>
                    <div className="w-full">
                      {item?.variant?.options?.map((option: any) => {
                        const optionName =
                          item?.variant?.product?.options.find((opt: any) => opt?.id === option?.option_id)?.title ||
                          "Option";
                        return (
                          <p key={option?.id}>
                            {optionName}: <strong>{option?.value}</strong>
                          </p>
                        );
                      })}
                    </div>
                    <p>
                      {formatAmount({
                        amount: item?.total || 0,
                        region: abandonedCart?.region,
                        includeTaxes: false,
                      })}
                    </p>
                    <InputField
                      required
                      label="Quantity"
                      name={`item_${i}_quantity`}
                      min={1}
                      type="number"
                      defaultValue={item.quantity}
                      onChange={(value) => {
                        handleUpdateQuantity(item.id, value.target.value);
                      }}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="danger"
                      onClick={() => {
                        handleDeleteItem(item?.id);
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end gap-x-2">
            <Button size="small" variant="secondary" type="button" onClick={close}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="primary"
              type="submit"
              onClick={() => {
                onSave();
                close();
              }}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};
export default EditAbandoned;
