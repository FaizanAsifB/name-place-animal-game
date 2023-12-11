import Carousel from '@itseasy21/react-elastic-carousel'

const AlphabetsScroll = () => {
  return (
    <Carousel
      isRTL={false}
      verticalMode={true}
      pagination={false}
      showArrows={false}
      enableMouseSwipe={false}
      enableSwipe={false}
      enableAutoPlay={true}
      autoPlaySpeed={45}
      transitionMs={45}
    >
      {alphabets.map(alphabet => {
        return <div key={alphabet}>{alphabet}</div>
      })}
    </Carousel>
  )
}
export default AlphabetsScroll
