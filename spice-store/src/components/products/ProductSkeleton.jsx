export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-orange-100 shadow-sm animate-pulse">
      {/* IMAGE PLACEHOLDER */}
      <div className="w-full h-[150px] sm:h-[200px] bg-gray-200"></div>

      {/* CONTENT PLACEHOLDER */}
      <div className="p-3 sm:p-5 space-y-3">
        {/* CATEGORY */}
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>

        {/* TITLE */}
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4"></div>

        {/* QUANTITY */}
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>

        {/* RATING */}
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded-full"></div>
          ))}
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1.5 mt-2 hidden sm:block">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* PRICE & BUTTON */}
        <div className="flex justify-between items-center mt-3 pt-1">
          <div className="h-6 sm:h-7 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-lg sm:rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
