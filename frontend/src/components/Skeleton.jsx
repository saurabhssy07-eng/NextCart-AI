const Skeleton = ({ className = '' }) => (
  <div className={`shimmer rounded ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
    <Skeleton className="w-full h-52" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-9 w-14" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
    <Skeleton className="w-full h-32" />
    <div className="p-3">
      <Skeleton className="h-4 w-24 mx-auto" />
    </div>
  </div>
);

export default Skeleton;
