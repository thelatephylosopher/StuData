import RiskPieChart from '../RiskPieChart'

export default function RiskPieChartExample() {
  return (
    <RiskPieChart 
      data={{ 
        lowRisk: 850, 
        mediumRisk: 320, 
        highRisk: 180 
      }} 
    />
  )
}
