export default function Vehicles() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Vehicles</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 text-center h-[400px]">
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-2xl font-bold tracking-tight">No vehicles found</h3>
          <p className="text-sm text-muted-foreground">
            You don't have any vehicles registered yet.
          </p>
        </div>
      </div>
    </div>
  );
}
