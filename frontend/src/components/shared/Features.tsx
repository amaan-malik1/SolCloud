import FeatureCard from "./featureCard"

const Features = () => {
  const FEATURES = [
    {

    }
  ]

  return (
    <div
      className="h-screen w-screen flex justify-center items-center flex-col"
    >
      <span className="text-center border border-orange-400 px-2 py-1 rounded-full">
        features
      </span>
      <div className="flex flex-shrink-0">
        {/* items */}
        <FeatureCard
          title='AI Voice Agents'
          description='Build scalable conversational AI experiences with real-time interactions and modern UX.'
        />
      </div>


    </div>
  )
}

export default Features