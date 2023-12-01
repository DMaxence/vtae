const CancelButton = ({ onCancel }: { onCancel: () => void }) => (
  <button
    type="button"
    className="w-full rounded-lg px-4 py-2 text-sm text-gray-500 transition-all duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-0 dark:text-gray-400 dark:hover:bg-stone-800 dark:hover:text-gray-300"
    onClick={onCancel}
  >
    CANCEL
  </button>
);

export default CancelButton;
