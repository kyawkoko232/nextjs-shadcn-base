export default async function Dashboard() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Welcome to Dashboard</h1>
        <p className="text-muted-foreground">
          Your personal dashboard is ready!
        </p>
      </div>
    </div>
  );
}
