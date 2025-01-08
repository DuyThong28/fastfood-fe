import { CheckoutTableHeader } from "@/components/checkout/checkout-table-header";
import { CheckoutTableRow } from "@/components/checkout/checkout-table-row";
import AddressesDialog, {
  AddressesDialogRef,
} from "@/components/customer/addresses-dialog";
import ProductLayout from "@/components/layouts/product-layout";
import CustomAlertDialog, {
  CustomAlertDialogRef,
} from "@/components/shared/alert-dialog";
import SectionCard from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { routes } from "@/config";
import addressService from "@/services/address.service";
import cartService from "@/services/cart.service";
import orderService from "@/services/order.service";
import { ResAddress } from "@/types/address";
import { ResCartItem } from "@/types/cart";
import { toastSuccess, toastWarning } from "@/utils/toast";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckOutRoute() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const state = queryParams.get("state") || "";
  const selectedProductIds = state.split(",");
  const [cartItemsSelected, setCartItemsSelected] = useState<
    Array<ResCartItem>
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [addressInfo, setAddressInfo] = useState<ResAddress | null>(null);
  const dialogRef = useRef<AddressesDialogRef>(null);
  const alertDialogRef = useRef<CustomAlertDialogRef | null>(null);
  const navigate = useNavigate();
  const getCartItemsSelected = async () => {
    try {
      const response = await cartService.getCart();
      setCartItemsSelected(
        response.data.data.filter((item) =>
          selectedProductIds.includes(item.product_id)
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getAllAddress = async () => {
    try {
      const response = await addressService.getAllAddressByUser();
      if (response.data.data.length > 0) {
        setAddressInfo(response.data.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllAddress();
    getCartItemsSelected();
  }, []);

  const handleCountTotalPrice = () =>
    cartItemsSelected.reduce((total, curr) => {
      return total + curr.product.price * curr.quantity;
    }, 0);

  const handleOrder = async () => {
    if (cartItemsSelected.length === 0) return;
    if (!addressInfo) {
      toastWarning(
        "Vui lòng cung cấp địa chỉ giao hàng trước khi xác nhận đơn hàng."
      );
      return;
    }
    alertDialogRef.current?.onOpen(
      {
        title: `Xác nhận đặt hàng?`,
      },
      async () => {
        const items = cartItemsSelected.map((item) => {
          return {
            productId: item.product_id,
            quantity: item.quantity,
          };
        });
        try {
          const response = await orderService.createOrder({
            fullName: addressInfo.full_name,
            address: addressInfo.address,
            phoneNumber: addressInfo.phone_number,
            items: items,
            paymentMethod: paymentMethod,
          });
          const responseData = response.data.data;
          if (responseData.payment_method == "MOMO" && responseData.id) {
            const paymentRespone = await orderService.createMOMOURL(
              responseData.id
            );
            if (paymentRespone && paymentRespone.data.data.payUrl) {
              window.location.href = paymentRespone.data.data.payUrl;
            } else {
              navigate(routes.CUSTOMER.PURCHASE);
              toastSuccess("Đặt hàng thành công");
            }
          } else {
            navigate(routes.CUSTOMER.PURCHASE);
            toastSuccess("Đặt hàng thành công");
          }
          console.log(response.data.data);
        } catch (err) {
          console.log(err);
        }
      }
    );
  };

  return (
    <ProductLayout>
      <CustomAlertDialog ref={alertDialogRef} />
      <AddressesDialog ref={dialogRef} onSetAddress={setAddressInfo} />
      <main className="flex flex-1 flex-col gap-6 py-6 md:pl-6 px-2">
        <div className="space-y-4">
          <h1 className="text-lg font-semibold text-[#A93F15]">
            Địa Chỉ Nhận Hàng
          </h1>
          <SectionCard className="flex flex-row justify-between items-center p-4">
            {addressInfo ? (
              <>
                <div className="flex flex-col gap-1">
                  <div>{addressInfo.full_name}</div>
                  <div className="text-sm">
                    <span className="text-[#787C80]">Địa chỉ:</span>{" "}
                    {addressInfo.address}
                  </div>
                  <div className="text-sm">
                    <span className="text-[#787C80]">Điện thoại:</span>{" "}
                    {addressInfo.phone_number}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="text-[#A93F15] ml-2 md:ml-0"
                  onClick={() => dialogRef.current?.onOpen(addressInfo)}
                >
                  Thay đổi
                </Button>
              </>
            ) : (
              <>
                <div>
                  Cung cấp địa chỉ giao hàng giúp chúng tôi gửi hàng đúng nơi.
                  Thêm địa chỉ ngay!
                </div>
                <Button
                  className="bg-[#A93F15] hover:bg-[#FF7E00]"
                  onClick={() => dialogRef.current?.onOpen()}
                >
                  Thêm địa chỉ
                </Button>
              </>
            )}
          </SectionCard>
        </div>
        <div className="space-y-4">
          <h1 className="text-lg font-semibold text-[#A93F15]">Sản Phẩm</h1>
          <SectionCard className="p-2">
            <CheckoutTableHeader />
            <div>
              {cartItemsSelected.map((item, index) => {
                return <CheckoutTableRow key={index} data={item} />;
              })}
            </div>
            <div className="flex p-4">
              <div className="ml-auto font-semibold text-[#A93F15]">{`Tổng số tiền (${
                cartItemsSelected.length
              } sản phẩm): ${handleCountTotalPrice()}`}</div>
            </div>
          </SectionCard>
        </div>
        <div className="space-y-4">
          <h1 className="text-lg font-semibold text-[#A93F15]">
            Phương Thức Thanh Toán
          </h1>
          <SectionCard className="p-2">
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="flex flex-row gap-2"
            >
              <div
                className={
                  paymentMethod === "CASH"
                    ? "px-4 py-4 border border-[#A93F15] text-[#A93F15] bg-[#fbb49767]  font-semibold w-[50%] rounded-md flex flex-row gap-4 items-center"
                    : "px-4 py-4 border border-black text-black font-semibold bg-white w-[50%] rounded-md flex flex-row gap-4 items-center"
                }
              >
                <RadioGroupItem value="CASH" id="r1" />
                <label htmlFor="r1" className="w-full">
                  Thanh toán khi nhận hàng
                </label>
              </div>
              <div
                className={
                  paymentMethod === "MOMO"
                    ? "px-4 py-4 border border-[#A93F15] text-[#A93F15] font-semibold bg-white w-[50%] rounded-md flex flex-row gap-4 items-center"
                    : "px-4 py-4 border border-black text-black font-semibold bg-white w-[50%] rounded-md flex flex-row gap-4 items-center"
                }
              >
                <RadioGroupItem value="MOMO" id="r2" />
                <label htmlFor="r2" className="w-full">
                  MOMO
                </label>
              </div>
            </RadioGroup>
          </SectionCard>
        </div>
        <SectionCard className="p-4 flex">
          <Button
            className="ml-auto bg-[#A93F15] hover:bg-[#FF7E00]"
            onClick={handleOrder}
          >
            Đặt hàng
          </Button>
        </SectionCard>
      </main>
    </ProductLayout>
  );
}
