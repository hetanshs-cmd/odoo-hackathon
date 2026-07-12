import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from "recharts";
import { reportsService } from "../services/reports";
import type {
  RevenueReport, ExpensesReport, FuelReport, TripSummary,
  FleetUtilization, DriverPerformanceItem, MaintenanceReport
} from "../services/reports";
import {
  DollarSign, Fuel, TrendingUp, Wrench, Loader2,
  AlertTriangle
} from "lucide-react";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#8b5cf6", "#14b8a6"];

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
      <AlertTriangle className="h-4 w-4" />
      {message}
    </div>
  );
}

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="text-sm font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function Reports() {
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [expenses, setExpenses] = useState<ExpensesReport | null>(null);
  const [fuel, setFuel] = useState<FuelReport | null>(null);
  const [trips, setTrips] = useState<TripSummary | null>(null);
  const [fleet, setFleet] = useState<FleetUtilization | null>(null);
  const [drivers, setDrivers] = useState<DriverPerformanceItem[] | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [revRes, expRes, fuelRes, tripRes, fleetRes, driverRes, maintRes] = await Promise.all([
          reportsService.getRevenue(),
          reportsService.getExpenses(),
          reportsService.getFuel(),
          reportsService.getTrips(),
          reportsService.getFleet(),
          reportsService.getDrivers(),
          reportsService.getMaintenance(),
        ]);
        if (revRes.data) setRevenue(revRes.data);
        if (expRes.data) setExpenses(expRes.data);
        if (fuelRes.data) setFuel(fuelRes.data);
        if (tripRes.data) setTrips(tripRes.data);
        if (fleetRes.data) setFleet(fleetRes.data);
        if (driverRes.data) setDrivers(driverRes.data);
        if (maintRes.data) setMaintenance(maintRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  // Transform data for charts
  const revenueChartData = revenue
    ? Object.entries(revenue.revenueByDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, amount]) => ({ date, revenue: amount }))
    : [];

  const expensesPieData = expenses
    ? Object.entries(expenses.expensesByCategory).map(([name, value]) => ({ name, value }))
    : [];

  const tripStatusData = trips?.byStatus || [];
  const fleetStatusData = fleet?.byStatus || [];

  const fuelBarData = fuel?.byVehicle
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 10)
    .map((v) => ({
      name: v.registration,
      fuel: v.totalFuel,
      cost: v.totalCost,
    })) || [];

  const driverBarData = (drivers || [])
    .sort((a, b) => b.completedTrips - a.completedTrips)
    .slice(0, 10)
    .map((d) => ({
      name: d.name.length > 12 ? d.name.slice(0, 12) + "…" : d.name,
      safetyScore: d.safetyScore,
      trips: d.completedTrips,
      revenue: d.totalRevenue,
    }));

  const maintBarData = maintenance?.byVehicle
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 10)
    .map((v) => ({
      name: v.registration,
      cost: v.totalCost,
      records: v.recordCount,
    })) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Reports & Analytics</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${(revenue?.totalRevenue || 0).toLocaleString()}`} sub="From completed trips" />
        <StatCard icon={TrendingUp} label="Total Expenses" value={`$${(expenses?.totalExpenses || 0).toLocaleString()}`} sub={`${Object.keys(expenses?.expensesByCategory || {}).length} categories`} />
        <StatCard icon={Fuel} label="Total Fuel" value={`${(fuel?.totalFuel || 0).toLocaleString()} L`} sub={`$${(fuel?.totalCost || 0).toLocaleString()} total cost`} />
        <StatCard icon={Wrench} label="Maintenance Cost" value={`$${(maintenance?.totalCost || 0).toLocaleString()}`} sub={`${maintenance?.totalRecords || 0} records`} />
      </div>

      {/* Tabbed Reports */}
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Over Time */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {revenueChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
                      <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No revenue data available yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Expenses Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {expensesPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={expensesPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {expensesPieData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No expense data available yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Fuel Costs by Vehicle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fuel Costs by Vehicle (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                {fuelBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fuelBarData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="cost" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Cost ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No fuel data available yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fleet Tab */}
        <TabsContent value="fleet" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Fleet Utilization Donut */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fleet Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                {fleetStatusData.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={fleetStatusData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="count" label={({ status, count }) => `${status}: ${count}`}>
                          {fleetStatusData.map((entry, index) => (
                            <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="text-sm text-muted-foreground mt-2">{fleet?.total || 0} total vehicles</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No fleet data available.</p>
                )}
              </CardContent>
            </Card>

            {/* Maintenance by Vehicle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Maintenance Costs by Vehicle (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                {maintBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={maintBarData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="cost" fill="#ef4444" radius={[0, 4, 4, 0]} name="Cost ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No maintenance data available yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Maintenance Status Breakdown */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Maintenance Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {(maintenance?.byStatus || []).length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={maintenance?.byStatus}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No maintenance records found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Driver Safety Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Driver Safety Scores</CardTitle>
              </CardHeader>
              <CardContent>
                {driverBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={driverBarData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="safetyScore" fill="#22c55e" radius={[0, 4, 4, 0]} name="Safety Score" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No driver data available.</p>
                )}
              </CardContent>
            </Card>

            {/* Driver Trip Counts & Revenue */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Driver Completed Trips</CardTitle>
              </CardHeader>
              <CardContent>
                {driverBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={driverBarData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="trips" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Completed Trips" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No driver data available.</p>
                )}
              </CardContent>
            </Card>

            {/* Driver Performance Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Driver Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Driver</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Safety</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Trips</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Distance</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Revenue</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Fuel (L)</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Efficiency</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(drivers || []).map((d, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-2 font-medium">{d.name}</td>
                          <td className="text-right py-3 px-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${d.safetyScore >= 80 ? 'bg-green-100 text-green-800' : d.safetyScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {d.safetyScore}
                            </span>
                          </td>
                          <td className="text-right py-3 px-2">{d.completedTrips}</td>
                          <td className="text-right py-3 px-2">{d.totalDistance.toLocaleString()} km</td>
                          <td className="text-right py-3 px-2">${d.totalRevenue.toLocaleString()}</td>
                          <td className="text-right py-3 px-2">{d.totalFuel.toLocaleString()}</td>
                          <td className="text-right py-3 px-2">{d.efficiency} km/L</td>
                          <td className="text-right py-3 px-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${d.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : d.status === 'ON_TRIP' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                              {d.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!drivers || drivers.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-8">No driver data available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Trip Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trip Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {tripStatusData.length > 0 ? (
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={tripStatusData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Trips">
                          {tripStatusData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between text-sm text-muted-foreground mt-4 px-2">
                      <span>{trips?.total || 0} total trips</span>
                      <span>${(trips?.totalRevenue || 0).toLocaleString()} total revenue</span>
                      <span>{(trips?.totalDistance || 0).toLocaleString()} km total distance</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No trip data available.</p>
                )}
              </CardContent>
            </Card>

            {/* Fuel Consumption */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fuel Consumption by Vehicle (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                {fuelBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fuelBarData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="fuel" fill="#14b8a6" radius={[0, 4, 4, 0]} name="Fuel (L)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No fuel data available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
