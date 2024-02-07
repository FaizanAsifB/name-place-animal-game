import { Skeleton } from '@/components/ui/skeleton'

const CreationSkeleton = () => {
  return (
    <div className="flex flex-col flex-1 p-6 space-y-6">
      <Skeleton className=" h-[100px]" />
      <div>
        <Skeleton className=" h-[50px] mx-auto w-[15ch]" />

        <div className="mt-8 space-y-10">
          <div className="space-y-6 text-center lg:text-start lg:grid lg:grid-cols-2 lg:items-center">
            <div className="lg:grid lg:gap-2">
              <div className="flex items-center justify-center gap-1 lg:justify-start ">
                <Skeleton className=" h-[24px] w-[24px] " />
                <Skeleton className=" h-[24px] w-[12ch] " />
              </div>
              <Skeleton className="hidden text-lg lg:block h-[24px] w-[30ch]" />
            </div>
            <Skeleton className="h-[24px]" />
          </div>
          <div className="space-y-6 text-center lg:text-start lg:grid lg:grid-cols-2 lg:items-center">
            <div className="lg:grid lg:gap-2">
              <div className="flex items-center justify-center gap-1 lg:justify-start ">
                <Skeleton className=" h-[24px] w-[24px] " />
                <Skeleton className=" h-[24px] w-[12ch] " />
              </div>
              <Skeleton className="hidden text-lg lg:block h-[24px] w-[30ch]" />
            </div>
            <Skeleton className="h-[24px]" />
          </div>
          <div className="space-y-6 text-center lg:text-start lg:grid lg:grid-cols-2 lg:items-center">
            <div className="lg:grid lg:gap-2">
              <div className="flex items-center justify-center gap-1 lg:justify-start ">
                <Skeleton className=" h-[24px] w-[24px] " />
                <Skeleton className=" h-[24px] w-[12ch] " />
              </div>
              <Skeleton className="hidden text-lg lg:block h-[24px] w-[30ch]" />
            </div>
            <Skeleton className="h-[24px]" />
          </div>
          <div className="space-y-6 text-center lg:text-start lg:grid lg:grid-cols-2 lg:items-center">
            <div className="lg:grid lg:gap-2">
              <div className="flex items-center justify-center gap-1 lg:justify-start ">
                <Skeleton className=" h-[24px] w-[24px] " />
                <Skeleton className=" h-[24px] w-[12ch] " />
              </div>
              <Skeleton className="hidden text-lg lg:block h-[24px] w-[30ch]" />
            </div>
            <Skeleton className="h-[24px]" />
          </div>
          <div className="space-y-6 text-center lg:text-start lg:grid lg:grid-cols-2 lg:items-center">
            <div className="lg:grid lg:gap-2">
              <div className="flex items-center justify-center gap-1 lg:justify-start ">
                <Skeleton className=" h-[24px] w-[24px] " />
                <Skeleton className=" h-[24px] w-[12ch] " />
              </div>
              <Skeleton className="hidden text-lg lg:block h-[24px] w-[30ch]" />
            </div>
            <Skeleton className="h-[24px]" />
          </div>
          <div className="space-y-6 text-center lg:text-start lg:grid lg:grid-cols-2 lg:items-center">
            <div className="lg:grid lg:gap-2">
              <div className="flex items-center justify-center gap-1 lg:justify-start ">
                <Skeleton className=" h-[24px] w-[24px] " />
                <Skeleton className=" h-[24px] w-[12ch] " />
              </div>
              <Skeleton className="hidden text-lg lg:block h-[24px] w-[30ch]" />
            </div>
            <Skeleton className="h-[24px]" />
          </div>
        </div>
        <Skeleton className="h-12 w-[12ch] mx-auto my-12" />
      </div>
    </div>
  )
}
export default CreationSkeleton
