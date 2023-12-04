import { Dialog, Transition } from "@headlessui/react";
import { Fragment, PropsWithChildren } from "react";

interface ModalProps extends PropsWithChildren {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
  onClose?: () => void;
  onSubmit?: () => void;
  onDelete?: () => Promise<void>;
  loading?: boolean;
  deleteLoading?: boolean;
  title?: string;
  fullScreen?: boolean;
}

export default function Modal({
  children,
  showModal,
  setShowModal,
  onClose,
  fullScreen = false,
}: ModalProps) {
  const close = () => {
    setShowModal(false);
    onClose?.();
  };

  return (
    <Transition show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto"
        onClose={close}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-100 bg-opacity-10 backdrop-blur" />
          {/* <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" /> */}
        </Transition.Child>

        {/* {!fullScreen && (
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
          )} */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {children}
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
