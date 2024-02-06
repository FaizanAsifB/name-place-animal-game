import { Skeleton } from '@/components/ui/skeleton'

const ResultSkeleton = () => {
  return (
    <div className="flex flex-col justify-between flex-1 my-6">
      <div>
        <Skeleton className="h-[50px] w-[200px] mx-auto" />
        <div className="flex justify-between mt-12">
          <Skeleton className="h-[50px] w-[150px]" />
          <Skeleton className="h-[50px] w-[150px]" />
          <Skeleton className="h-[50px] w-[150px]" />
          <Skeleton className="h-[50px] w-[150px]" />
        </div>
        <div className="mt-8 space-y-4">
          <Skeleton className="w-full h-[50px]" />
          <Skeleton className="w-full h-[50px]" />
          <Skeleton className="w-full h-[50px]" />
          <Skeleton className="w-full h-[50px]" />
          <Skeleton className="w-full h-[50px]" />
          <Skeleton className="w-full h-[50px]" />
        </div>
      </div>
      <Skeleton className="w-32 h-12 mx-auto my-6 " />
    </div>
  )
}
export default ResultSkeleton
