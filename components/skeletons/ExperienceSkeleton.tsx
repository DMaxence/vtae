const ExperienceSkeleton = () => (
  <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
    <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300 animate-pulse" />
    <div className="relative p-10 grid gap-5">
      <div className="w-28 h-10 rounded-md bg-gray-300 animate-pulse" />
      <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
      <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
      <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
    </div>
  </div>
)

export default ExperienceSkeleton
