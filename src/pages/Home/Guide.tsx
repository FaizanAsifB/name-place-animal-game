import img from '../../assets/imgs/note-1173544_640.png'

const Guide = () => {
  return (
    <div className="hidden p-4 space-y-8 text-center border-2 lg:col-start-4 lg:row-span-2 col-span-full lg:pb-0 md:block">
      <h2 className="capitalize">How To Play</h2>
      <div className="flex gap-8 lg:flex-col">
        <img src={img} alt="" className="w-56 mx-auto" />
        <div>
          <h3 className="mb-2 text-2xl">
            <span>1.</span>Assemble Ghari Shahu Avengers
          </h3>
          <p className="text-xl">It's fun to play with friends</p>
        </div>
      </div>
    </div>
  )
}
export default Guide
