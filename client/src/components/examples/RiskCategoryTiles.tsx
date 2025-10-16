import RiskCategoryTiles from '../RiskCategoryTiles'

export default function RiskCategoryTilesExample() {
  return (
    <RiskCategoryTiles 
      counts={{ 
        critical: 180, 
        medium: 320, 
        onTrack: 850 
      }} 
    />
  )
}
