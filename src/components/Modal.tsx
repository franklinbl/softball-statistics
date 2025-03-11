import CloseIcon from "../../public/assets/svgs/CloseIcon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(3,7,19,0.5)]">
      <div className="bg-white rounded-lg p-6 min-w-2xs max-w-7xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-100 hover:text-gray-400 focus:outline-none cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;