import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Package,
  DollarSign,
  Download,
  Calendar,
  Building2,
  FileText,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const monthlySpendData = [
  { month: 'Aug', amount: 125000 },
  { month: 'Sep', amount: 180000 },
  { month: 'Oct', amount: 145000 },
  { month: 'Nov', amount: 210000 },
  { month: 'Dec', amount: 165000 },
  { month: 'Jan', amount: 195000 },
];

const categoryData = [
  { name: 'Cement', value: 35, color: '#1a3a5c' },
  { name: 'Steel', value: 28, color: '#f59e0b' },
  { name: 'Electrical', value: 15, color: '#10b981' },
  { name: 'Plumbing', value: 12, color: '#0ea5e9' },
  { name: 'Finishing', value: 10, color: '#8b5cf6' },
];

const projectSpendData = [
  { project: 'Marina Bay', budget: 500000, spent: 320000 },
  { project: 'Riverside', budget: 350000, spent: 180000 },
  { project: 'Tech Park', budget: 420000, spent: 290000 },
  { project: 'Heritage', budget: 280000, spent: 95000 },
];

const requestTrendData = [
  { month: 'Aug', submitted: 45, approved: 42, rejected: 3 },
  { month: 'Sep', submitted: 52, approved: 48, rejected: 4 },
  { month: 'Oct', submitted: 38, approved: 35, rejected: 3 },
  { month: 'Nov', submitted: 61, approved: 55, rejected: 6 },
  { month: 'Dec', submitted: 48, approved: 45, rejected: 3 },
  { month: 'Jan', submitted: 55, approved: 50, rejected: 5 },
];

export default function Reports() {
  return (
    <MainLayout 
      title="Reports & Analytics" 
      subtitle="Insights into procurement performance and spending"
    >
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select defaultValue="last6months">
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="last3months">Last 3 Months</SelectItem>
            <SelectItem value="last6months">Last 6 Months</SelectItem>
            <SelectItem value="lastyear">Last Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="marina">Marina Bay Tower</SelectItem>
            <SelectItem value="riverside">Riverside Complex</SelectItem>
            <SelectItem value="techpark">Tech Park Phase 2</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spend</p>
              <p className="text-2xl font-bold text-foreground mt-1">$1.02M</p>
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last period
              </p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10">
              <DollarSign className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold text-foreground mt-1">299</p>
              <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
            </div>
            <div className="p-3 rounded-lg bg-info/10">
              <FileText className="h-6 w-6 text-info" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approval Rate</p>
              <p className="text-2xl font-bold text-foreground mt-1">92%</p>
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +3% from last period
              </p>
            </div>
            <div className="p-3 rounded-lg bg-success/10">
              <BarChart3 className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
              <p className="text-2xl font-bold text-foreground mt-1">2.3 days</p>
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                -0.5 days improvement
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Spend Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Procurement Spend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spend']}
                />
                <Bar dataKey="amount" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Spend by Category</h3>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <RechartsPie>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Request Trends */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Request Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={requestTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="submitted" 
                stroke="hsl(var(--info))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--info))' }}
              />
              <Line 
                type="monotone" 
                dataKey="approved" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--success))' }}
              />
              <Line 
                type="monotone" 
                dataKey="rejected" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Budget Table */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Budget Utilization</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th className="text-right">Budget</th>
                <th className="text-right">Spent</th>
                <th className="text-right">Remaining</th>
                <th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {projectSpendData.map((project) => {
                const utilization = (project.spent / project.budget) * 100;
                const remaining = project.budget - project.spent;
                return (
                  <tr key={project.project}>
                    <td className="font-medium">{project.project}</td>
                    <td className="text-right text-muted-foreground">
                      ${project.budget.toLocaleString()}
                    </td>
                    <td className="text-right font-medium">
                      ${project.spent.toLocaleString()}
                    </td>
                    <td className="text-right text-success">
                      ${remaining.toLocaleString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {utilization.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
