import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/button";
import { ResAddress } from "@/types/address";
import addressService from "@/services/address.service";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PlusCircle } from "lucide-react";
import AddressDialog, { AddressDialogRef } from "./address-dialog";

export interface AddressesDialogRef {
  onOpen: (data?: ResAddress) => void;
  onClose: () => void;
}

interface AddressesDialogProps {
  onSetAddress: Dispatch<SetStateAction<ResAddress>>;
}

const AddressesDialog = forwardRef<AddressesDialogRef, AddressesDialogProps>(
  function AddressesDialog({ onSetAddress }, ref) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [addressId, setAddressId] = useState<string>("");
    const [addresses, setAddresses] = useState<ResAddress[]>([]);
    const dialogRef = useRef<AddressDialogRef>(null);

    const getAllAddress = async () => {
      try {
        const response = await addressService.getAllAddressByUser();
        setAddresses(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    const handleAddNew = () => {
      dialogRef.current?.onOpen();
    };

    useEffect(() => {
      getAllAddress();
    }, []);

    useImperativeHandle(ref, () => {
      return {
        onOpen(data?: ResAddress) {
          if (data) {
            setAddressId(data.id);
          }
          setIsOpen(true);
        },
        onClose() {
          setIsOpen(false);
        },
      };
    }, []);

    const handleSetAddress = () => {
      const selectedAddress = addresses.find((item) => item.id === addressId);
      if (selectedAddress) onSetAddress(selectedAddress);
      setIsOpen(false);
    };

    return (
      <>
        <AddressDialog ref={dialogRef} onRefetch={getAllAddress} />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[425px] h-[80%]">
            <DialogHeader>
              <DialogTitle>Dia chi cua toi</DialogTitle>
            </DialogHeader>
            <RadioGroup
              className="overflow-y-auto no-scrollbar"
              defaultValue={addressId}
              onValueChange={(value) => {
                const selectedAddress = addresses.find(
                  (item) => item.id === value
                );
                if (selectedAddress) {
                  setAddressId(selectedAddress.id);
                }
              }}
            >
              {addresses.map((item, index) => {
                return (
                  <div
                    className="flex py-3 flex-row justify-between border-b border-gray-300"
                    key={index}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={item.id} id="r1" />
                      <div className="flex flex-col gap-1">
                        <div>{item.full_name}</div>
                        <div className="text-sm">
                          <span className="text-[#787C80]">Dia chi: </span>
                          {item.address}
                        </div>
                        <div className="text-sm">
                          <span className="text-[#787C80]">Dien thoai: </span>
                          {item.phone_number}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-4 items-center">
                      <Button
                        variant="secondary"
                        onClick={() => dialogRef.current?.onOpen(item)}
                      >
                        Chinh sua
                      </Button>
                    </div>
                  </div>
                );
              })}
              <Button
                className="gap-1 py-3 my-3"
                variant={"outline"}
                onClick={handleAddNew}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Them dia chi moi
                </span>
              </Button>
            </RadioGroup>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Huy
              </Button>
              <Button onClick={handleSetAddress}>Xac nhan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

export default AddressesDialog;
