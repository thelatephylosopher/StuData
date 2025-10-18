import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function WelcomeSection() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>
          Here's a quick overview of your student data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          You can use this dashboard to monitor student performance, identify
          at-risk students, and take proactive measures to support their
          success. The table below shows a list of all students, and you can
          click on each student to view more detailed information.
        </p>
      </CardContent>
    </Card>
  );
}
