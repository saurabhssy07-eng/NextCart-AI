export const Skeleton = ({ className = '' }) => (
  <div className={`shimmer rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <Skeleton className="w-full aspect-square" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-10 w-full mt-2" />
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <Skeleton className="w-full aspect-[4/3]" />
    <div className="p-4">
      <Skeleton className="h-5 w-3/4 mx-auto" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="w-24 h-24 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

export const AddressSkeleton = () => (
  <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 space-y-3">
    <Skeleton className="h-5 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

export const OrderSkeleton = () => (
  <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-6 flex flex-col sm:flex-row justify-between gap-4">
    <div className="space-y-2 flex-1">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="flex flex-col sm:items-end gap-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-8 w-32 rounded-lg" />
    </div>
  </div>
);

export default Skeleton;
