import { Skeleton } from '@/components/ui/skeleton'

const GameSkeleton = () => {
  return (
    <>
      <div className="flex justify-between py-8 ">
        <Skeleton className="h-[100px] w-[100px]" />
        <Skeleton className="h-[100px] w-[200px]" />
        <Skeleton className="h-[100px] w-[100px]" />
      </div>
      <div className="pt-6 pb-8 md:pb-12 lg:pb-16 lg:pt-8">
        <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:grid-rows-3">
          <Skeleton className="w-full h-[250px]" />
          <Skeleton className="w-full h-[250px]" />
          <Skeleton className="w-full h-[250px]" />
          <Skeleton className="w-full h-[250px]" />
          <Skeleton className="w-full h-[250px]" />
          <Skeleton className="w-full h-[250px]" />
        </div>
        <div>
          <Skeleton className="w-32 h-12 mx-auto my-6" />
        </div>
      </div>
    </>
  )
}
export default GameSkeleton
