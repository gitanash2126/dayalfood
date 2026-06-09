export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[28px] overflow-hidden border border-orange-100 shadow-sm animate-pulse">
      {/* IMAGE PLACEHOLDER */}
      <div className="w-full h-[280px] bg-gray-200"></div>

      {/* CONTENT PLACEHOLDER */}
      <div className="p-6 space-y-4">
        {/* CATEGORY */}
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>

        {/* TITLE */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>

        {/* QUANTITY */}
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>

        {/* RATING */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
          ))}
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2 mt-4">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* PRICE & BUTTON */}
        <div className="flex justify-between items-center mt-6 pt-2">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 w-12 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
