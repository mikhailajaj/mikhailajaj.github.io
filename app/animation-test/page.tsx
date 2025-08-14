export default function AnimationTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Animation Test Page
        </h1>
        <p className="text-muted-foreground">
          If you can see this page, routing is working correctly.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          URL: /animation-test
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Animation Test | Mikhail Ajaj",
  description: "Test page for animation routing",
};