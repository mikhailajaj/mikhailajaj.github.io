"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import * as Slider from "@radix-ui/react-slider";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Layers,
  AlertTriangle,
} from "lucide-react";

interface ROIInputs {
  projectScope: number;
  timeline: number;
  complexity: number;
  teamSize: number;
  expectedRevenue: number;
}

interface ROIResults {
  estimatedCost: number;
  projectedROI: number;
  breakEvenTime: number;
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
  profitMargin: number;
  monthlyRevenue: number;
}

const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    projectScope: 5,
    timeline: 6,
    complexity: 3,
    teamSize: 4,
    expectedRevenue: 150000,
  });

  const [results, setResults] = useState<ROIResults>({
    estimatedCost: 0,
    projectedROI: 0,
    breakEvenTime: 0,
    riskLevel: "medium",
    recommendations: [],
    profitMargin: 0,
    monthlyRevenue: 0,
  });

  // Calculate ROI in real-time
  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const calculateROI = () => {
    // Base calculation as specified: Scope × Timeline × Complexity × Team Size × $5000
    const baseCost =
      inputs.projectScope *
      inputs.timeline *
      inputs.complexity *
      inputs.teamSize *
      5000;

    // Add complexity multipliers
    const complexityMultiplier =
      {
        1: 0.8,
        2: 0.9,
        3: 1.0,
        4: 1.2,
        5: 1.5,
      }[inputs.complexity] || 1.0;

    const estimatedCost = baseCost * complexityMultiplier;
    const netProfit = inputs.expectedRevenue - estimatedCost;
    const projectedROI =
      estimatedCost > 0 ? (netProfit / estimatedCost) * 100 : 0;
    const profitMargin =
      inputs.expectedRevenue > 0
        ? (netProfit / inputs.expectedRevenue) * 100
        : 0;
    const monthlyRevenue = inputs.expectedRevenue / 12;
    const breakEvenTime = netProfit > 0 ? estimatedCost / monthlyRevenue : 0;

    // Risk assessment
    let riskLevel: "low" | "medium" | "high" = "medium";
    if (projectedROI > 200 && inputs.complexity <= 3) riskLevel = "low";
    else if (projectedROI < 50 || inputs.complexity >= 4) riskLevel = "high";

    // Generate recommendations
    const recommendations: string[] = [];
    if (projectedROI < 100)
      recommendations.push(
        "Consider reducing project scope or increasing expected revenue",
      );
    if (inputs.complexity >= 4)
      recommendations.push(
        "High complexity detected - consider phased implementation",
      );
    if (inputs.teamSize > 8)
      recommendations.push(
        "Large team size may impact efficiency - consider smaller focused teams",
      );
    if (breakEvenTime > 12)
      recommendations.push(
        "Long break-even time - consider faster revenue generation strategies",
      );
    if (projectedROI > 300)
      recommendations.push("Excellent ROI potential - prioritize this project");

    setResults({
      estimatedCost,
      projectedROI,
      breakEvenTime,
      riskLevel,
      recommendations,
      profitMargin,
      monthlyRevenue,
    });
  };

  const updateInput = (key: keyof ROIInputs, value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setInputs((prev) => ({ ...prev, [key]: newValue }));
  };

  // Chart data
  const costBreakdownData = [
    {
      name: "Development",
      value: results.estimatedCost * 0.6,
      color: "#0070f3",
    },
    { name: "Testing", value: results.estimatedCost * 0.2, color: "#7928ca" },
    {
      name: "Deployment",
      value: results.estimatedCost * 0.1,
      color: "#00d9ff",
    },
    {
      name: "Management",
      value: results.estimatedCost * 0.1,
      color: "#f5a623",
    },
  ];

  const roiComparisonData = [
    {
      scenario: "Conservative",
      roi: results.projectedROI * 0.7,
      cost: results.estimatedCost,
    },
    {
      scenario: "Realistic",
      roi: results.projectedROI,
      cost: results.estimatedCost,
    },
    {
      scenario: "Optimistic",
      roi: results.projectedROI * 1.3,
      cost: results.estimatedCost * 0.9,
    },
  ];

  const timelineData = Array.from({ length: inputs.timeline }, (_, i) => ({
    month: i + 1,
    revenue: (inputs.expectedRevenue / inputs.timeline) * (i + 1),
    cost: results.estimatedCost,
    profit: Math.max(
      0,
      (inputs.expectedRevenue / inputs.timeline) * (i + 1) -
        results.estimatedCost,
    ),
  }));

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "medium":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="w-8 h-8 text-blue-400" />
        <h2 className="text-3xl font-bold text-white">
          Advanced ROI Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Project Parameters
            </h3>

            {/* Project Scope Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Project Scope
                </label>
                <span className="text-blue-400 font-semibold">
                  {inputs.projectScope}/10
                </span>
              </div>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[inputs.projectScope]}
                onValueChange={(value) => updateInput("projectScope", value)}
                max={10}
                min={1}
                step={1}
              >
                <Slider.Track className="bg-gray-600 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-blue-400 shadow-lg rounded-full hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </Slider.Root>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Simple</span>
                <span>Complex</span>
              </div>
            </div>

            {/* Timeline Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </label>
                <span className="text-blue-400 font-semibold">
                  {inputs.timeline} months
                </span>
              </div>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[inputs.timeline]}
                onValueChange={(value) => updateInput("timeline", value)}
                max={12}
                min={1}
                step={1}
              >
                <Slider.Track className="bg-gray-600 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-purple-500 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-purple-400 shadow-lg rounded-full hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </Slider.Root>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 month</span>
                <span>12 months</span>
              </div>
            </div>

            {/* Complexity Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Complexity
                </label>
                <span className="text-blue-400 font-semibold">
                  {inputs.complexity}/5
                </span>
              </div>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[inputs.complexity]}
                onValueChange={(value) => updateInput("complexity", value)}
                max={5}
                min={1}
                step={1}
              >
                <Slider.Track className="bg-gray-600 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-orange-500 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-orange-400 shadow-lg rounded-full hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </Slider.Root>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Basic</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Team Size Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Size
                </label>
                <span className="text-blue-400 font-semibold">
                  {inputs.teamSize} people
                </span>
              </div>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[inputs.teamSize]}
                onValueChange={(value) => updateInput("teamSize", value)}
                max={10}
                min={1}
                step={1}
              >
                <Slider.Track className="bg-gray-600 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-green-500 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-green-400 shadow-lg rounded-full hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" />
              </Slider.Root>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Solo</span>
                <span>Large Team</span>
              </div>
            </div>

            {/* Expected Revenue */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Expected Revenue
              </label>
              <input
                type="number"
                value={inputs.expectedRevenue}
                onChange={(e) =>
                  updateInput(
                    "expectedRevenue",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="e.g., 150000"
              />
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Estimated Cost</span>
                <DollarSign className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                ${results.estimatedCost.toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Projected ROI</span>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400 mt-1">
                {results.projectedROI.toFixed(1)}%
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Break-even Time</span>
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {results.breakEvenTime.toFixed(1)} months
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Risk Level</span>
                {getRiskIcon(results.riskLevel)}
              </div>
              <div
                className={`text-2xl font-bold mt-1 capitalize ${getRiskColor(results.riskLevel)}`}
              >
                {results.riskLevel}
              </div>
            </div>
          </div>

          {/* Cost Breakdown Chart */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4">
              Cost Breakdown
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Cost",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ROI Scenarios */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4">
              ROI Scenarios
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={roiComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="scenario" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "roi"
                      ? `${value.toFixed(1)}%`
                      : `$${value.toLocaleString()}`,
                    name === "roi" ? "ROI" : "Cost",
                  ]}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                  }}
                />
                <Bar dataKey="roi" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {results.recommendations.length > 0 && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">
            Recommendations
          </h4>
          <ul className="space-y-2">
            {results.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-blue-400 mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline Projection */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4">
          Revenue Timeline
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name,
              ]}
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2}
              name="Cumulative Revenue"
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#EF4444"
              strokeWidth={2}
              name="Total Cost"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ROICalculator;
