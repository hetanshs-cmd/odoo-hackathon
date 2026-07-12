export default function Settings() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 text-center h-[400px]">
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-2xl font-bold tracking-tight">Settings Placeholder</h3>
          <p className="text-sm text-muted-foreground">
            Your application settings will be managed here.
          </p>
        </div>
      </div>
    </div>
  );
}
