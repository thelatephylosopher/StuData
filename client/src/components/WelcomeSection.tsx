export default function WelcomeSection() {
  return (
    <div className="bg-card border border-card-border rounded-md p-8 shadow-sm w-[50rem]">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Welcome to Studata</h2>
      <p className="text-base text-foreground leading-relaxed">
        Studata is an AI powered tool that uses a mix of personal (gender, age, etc.), historical (nationality), and academic information (grades, performance) to predict the academic status of each student at the end of the normal duration of their program. Its main aim is to help identify students at risk of dropping out or extending the normal duration of study, investigate timely, and if required, provide them with the opportunities and aid they may benefit from.
      </p>
    </div>
  );
}
