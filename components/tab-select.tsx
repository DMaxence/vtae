export function TabSelect({
  options,
  selected,
  selectAction,
}: {
  options: string[];
  selected: string;
  selectAction: (option: string) => void;
}) {
  return (
    <div className="relative inline-flex items-center space-x-3">
      {options.map((option) => (
        <button
          key={option}
          className={`${
            option === selected
              ? "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-1 dark:ring-dark-tremor-ring"
          } rounded-md px-2 py-1 text-sm font-medium capitalize transition-all duration-75 active:scale-95 sm:px-3`}
          onClick={() => selectAction(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
