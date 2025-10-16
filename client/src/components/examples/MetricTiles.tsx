import MetricTiles from '../MetricTiles'

export default function MetricTilesExample() {
  return (
    <MetricTiles 
      metrics={{
        creditsCompleted: 85,
        creditsRequired: 120,
        currentGPA: 2.1,
        lastSemesterGPA: 1.9
      }}
    />
  )
}
