import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { forwardRef, useImperativeHandle, useState } from "react";

export interface CustomAlertDialogRef {
  onOpen: (info: AlertInfo, action: () => Promise<void>) => void;
  onClose: () => void;
}

export interface AlertDialogProviderProps {}

interface AlertInfo {
  title?: string;
  description?: string;
}

const CustomAlertDialog = forwardRef<
  CustomAlertDialogRef,
  AlertDialogProviderProps
>(function CustomAlertDialog(_, ref) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({});
  const [confirmAction, setConfirmAction] = useState<
    (() => Promise<void>) | null
  >(null);

  useImperativeHandle(ref, () => {
    return {
      onOpen(info: AlertInfo, action: () => Promise<void>) {
        setAlertInfo(info);
        setConfirmAction(() => action);
        setIsOpen(true);
      },
      onClose() {
        setAlertInfo({});
        setConfirmAction(null);
        setIsOpen(false);
      },
    };
  });

  const handleCancel = () => {
    setIsOpen(false);
    setAlertInfo({});
    setConfirmAction(null);
  };

  const handleContinue = async () => {
    if (confirmAction) {
      await confirmAction();
    }
    setIsOpen(false);
    setAlertInfo({});
    setConfirmAction(null);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {alertInfo.title && (
            <AlertDialogTitle className="text-[#A93F15] hover:text-[#A93F15]">
              {alertInfo.title}
            </AlertDialogTitle>
          )}
          {alertInfo.description && (
            <AlertDialogDescription>
              {alertInfo.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className="text-[#A93F15] hover:text-[#A93F15]"
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleContinue}
            className="bg-[#A93F15] hover:bg-[#FF7E00]"
          >
            Tiếp tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

export default CustomAlertDialog;
