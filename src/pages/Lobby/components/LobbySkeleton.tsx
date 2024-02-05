import { Skeleton } from '@/components/ui/skeleton'

const LobbySkeleton = () => {
  return (
    <>
      <div className="grid py-8 place-items-center ">
        <Skeleton className="h-[200px] w-[200px]" />
      </div>
      <div className="my-4 space-y-8 ">
        <div className="grid gap-y-4 md:gap-x-4 md:grid-cols-5 md:grid-rows-3 xl:grid-cols-6">
          <Skeleton className="px-4 py-6 space-y-6 md:col-span-3 md:row-span-full bg-muted/90">
            <Skeleton className="h-10 " />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </Skeleton>

          <Skeleton className="rounded-lg col-span-full md:col-start-4 md:row-span-2 " />
          <Skeleton className="rounded-lg col-span-full md:row-start-3 md:col-start-4" />
        </div>
        <div className="flex justify-around">
          <Skeleton className="w-32 h-12 mx-auto my-6" />
          <Skeleton className="w-32 h-12 mx-auto my-6" />
        </div>
      </div>
    </>
  )
}
export default LobbySkeleton
