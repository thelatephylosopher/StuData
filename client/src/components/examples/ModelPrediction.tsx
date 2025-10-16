import ModelPrediction from '../ModelPrediction'

export default function ModelPredictionExample() {
  const mockFactors = [
    { name: "Curricular units 2nd sem (grade)", importance: 24 },
    { name: "Curricular units 1st sem (grade)", importance: 18 },
    { name: "Previous qualification (grade)", importance: 15 },
    { name: "Admission grade", importance: 12 },
    { name: "Age at enrollment", importance: 10 },
  ];

  return (
    <ModelPrediction 
      riskLevel="critical" 
      factors={mockFactors} 
    />
  )
}
