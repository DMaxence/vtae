export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-center py-7 print:hidden">
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Powered by{" "}
        <a
          className="font-semibold text-black underline dark:text-gray-300"
          href="https://vtae.xyz"
          rel="noreferrer noopener"
          target="_blank"
        >
          vtae.xyz
        </a>
      </p>
    </footer>
  );
}
