import LoadingDots from "./icons/loading-dots";

const SubmitButton = ({
  onSubmit,
  loading,
}: {
  onSubmit?: () => void;
  loading: boolean;
}) => (
  <button
    type="submit"
    disabled={loading}
    onClick={onSubmit}
    className={`${
      loading
        ? "cursor-not-allowed bg-blue-100 text-gray-400 dark:bg-gray-800 dark:text-gray-100"
        : "text-blue-400 hover:bg-blue-100 hover:text-blue-500 dark:text-blue-500 dark:hover:bg-gray-800 dark:hover:text-blue-400"
    } w-full rounded-lg px-4 py-2 text-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-0`}
  >
    {loading ? <LoadingDots /> : "SAVE"}
  </button>
);

export default SubmitButton;
