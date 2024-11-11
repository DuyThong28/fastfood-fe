import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Label } from "@/components/ui/label";
  import {
    FormEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
  } from "react";
  import { Button } from "../ui/button";
  import { Input } from "../ui/input";
  import { Address, ResAddress } from "@/types/address";
  import addressService from "@/services/address.service";
  
  export interface AddressDialogRef {
    onOpen: (data?: ResAddress) => void;
    onClose: () => void;
  }
  
  interface AddressDialogProps {
    onRefetch: () => Promise<void>;
  }
  
  const AddressDialog = forwardRef<AddressDialogRef, AddressDialogProps>(
    function AddressDialog({ onRefetch }, ref) {
      const [isOpen, setIsOpen] = useState<boolean>(false);
      const [address, setAddress] = useState<Address>({
        address: "",
        fullName: "",
        phoneNumber: undefined,
      });
  
      useImperativeHandle(
        ref,
        () => {
          return {
            onOpen(data?: ResAddress) {
              if (data) {
                setAddress({
                  address: data.address,
                  fullName: data.full_name,
                  phoneNumber: data.phone_number,
                  id: data.id,
                });
                setIsOpen(true);
              } else {
                setIsOpen(true);
              }
            },
            onClose() {
              setIsOpen(false);
            },
          };
        },
        []
      );
  
      useEffect(() => {
        if (!isOpen) {
          setAddress({
            address: "",
            fullName: "",
            phoneNumber: undefined,
          });
        }
      }, [isOpen]);
  
      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (address.id) {
          try {
            await addressService.updateAddressById(address);
            await onRefetch();
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
            await addressService.createAddress({
              address: address.address,
              fullName: address.fullName,
              phoneNumber: address.phoneNumber,
            });
            await onRefetch();
          } catch (err) {
            console.log(err);
          }
        }
        setIsOpen(false);
        setAddress({
          address: "",
          fullName: "",
          phoneNumber: undefined,
        });
      };
  
      const handleChangeInput = (
        name: string,
        value: string | number | undefined
      ) => {
        setAddress((prevData) => {
          return {
            ...prevData,
            [name]: value,
          };
        });
      };
  
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {address.id ? "Chinh sua dia chi" : "Them dia chi moi"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <Label htmlFor="fullName">Ho va ten</Label>
                <Input
                  id="fullName"
                  placeholder="Ho va ten"
                  value={address.fullName}
                  onChange={(e) => handleChangeInput("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="phoneNumber">So dien thoai</Label>
                <Input
                  type="number"
                  min={0}
                  id="phoneNumber"
                  placeholder="So dien thoai"
                  value={address.phoneNumber}
                  onChange={(e) =>
                    handleChangeInput("phoneNumber", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="name">Dia chi</Label>
                <Input
                  id="address"
                  placeholder="Dia chi"
                  value={address.address}
                  onChange={(e) => handleChangeInput("address", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Huy
                </Button>
                <Button type="submit">Luu</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      );
    }
  );
  
  export default AddressDialog;
  