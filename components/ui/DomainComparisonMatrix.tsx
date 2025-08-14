"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllDomainThemes, DomainTheme } from "@/lib/config/domainThemes";
import { DomainPatternOverlay } from "./DomainPatternOverlay";

interface DomainComparisonMatrixProps {
  className?: string;
  showMetrics?: boolean;
}

export const DomainComparisonMatrix: React.FC<DomainComparisonMatrixProps> = ({
  className = "",
  showMetrics = true,
}) => {
  const domains = getAllDomainThemes();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  const comparisonCategories = [
    { key: "expertise", label: "Core Expertise", icon: "🎯" },
    { key: "tools", label: "Primary Tools", icon: "🛠️" },
    { key: "impact", label: "Business Impact", icon: "📈" },
    { key: "approach", label: "Methodology", icon: "🔄" },
  ];

  const getDomainData = (domain: DomainTheme, category: string) => {
    switch (category) {
      case "expertise":
        return domain.expertise.slice(0, 2);
      case "tools":
        return domain.secondaryIcons.slice(0, 2);
      case "impact":
        return domain.keyMetrics.slice(0, 1);
      case "approach":
        return [domain.tagline];
      default:
        return [];
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <AnimatePresence>
          {(selectedDomain || hoveredDomain) && (
            <DomainPatternOverlay
              theme={
                domains.find((d) => d.id === (selectedDomain || hoveredDomain))!
              }
              isActive={!!selectedDomain}
              intensity="low"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white mb-2">
            Domain Expertise Matrix
          </h3>
          <p className="text-gray-300 text-sm">
            Compare specialized capabilities across all five domains
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-white font-semibold">
                  Domain
                </th>
                {comparisonCategories.map((category) => (
                  <th
                    key={category.key}
                    className="p-4 text-center text-white font-semibold min-w-[150px]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm">{category.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {domains.map((domain, domainIndex) => (
                <motion.tr
                  key={domain.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                  onClick={() =>
                    setSelectedDomain(
                      selectedDomain === domain.id ? null : domain.id,
                    )
                  }
                  onHoverStart={() => setHoveredDomain(domain.id)}
                  onHoverEnd={() => setHoveredDomain(null)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: domainIndex * 0.1, duration: 0.5 }}
                >
                  {/* Domain Name Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${domain.gradientColors[0]}, ${domain.gradientColors[1]})`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <domain.primaryIcon className="text-white text-sm" />
                      </motion.div>
                      <div>
                        <div
                          className="font-semibold transition-colors duration-200"
                          style={{
                            color:
                              hoveredDomain === domain.id
                                ? domain.primaryColor
                                : "white",
                          }}
                        >
                          {domain.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {domain.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category Columns */}
                  {comparisonCategories.map((category) => (
                    <td key={category.key} className="p-4 text-center">
                      <div className="space-y-2">
                        {category.key === "expertise" && (
                          <div className="space-y-1">
                            {getDomainData(domain, category.key).map(
                              (skill: string, skillIndex: number) => (
                                <motion.div
                                  key={skillIndex}
                                  className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 border border-white/20"
                                  whileHover={{
                                    backgroundColor: `${domain.primaryColor}20`,
                                    borderColor: `${domain.primaryColor}60`,
                                    color: domain.primaryColor,
                                    scale: 1.05,
                                  }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {skill}
                                </motion.div>
                              ),
                            )}
                          </div>
                        )}

                        {category.key === "tools" && (
                          <div className="flex justify-center gap-2">
                            {getDomainData(domain, category.key).map(
                              (
                                Icon: React.ComponentType<any>,
                                iconIndex: number,
                              ) => (
                                <motion.div
                                  key={iconIndex}
                                  className="w-6 h-6 rounded bg-white/10 flex items-center justify-center"
                                  whileHover={{
                                    backgroundColor: `${domain.primaryColor}20`,
                                    scale: 1.2,
                                  }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Icon className="text-xs text-gray-300" />
                                </motion.div>
                              ),
                            )}
                          </div>
                        )}

                        {category.key === "impact" && (
                          <div className="space-y-1">
                            {getDomainData(domain, category.key).map(
                              (metric: any, metricIndex: number) => (
                                <div key={metricIndex} className="text-center">
                                  <div
                                    className="text-lg font-bold transition-colors duration-200"
                                    style={{
                                      color:
                                        hoveredDomain === domain.id
                                          ? domain.primaryColor
                                          : "white",
                                    }}
                                  >
                                    {metric.value}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {metric.label}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                        {category.key === "approach" && (
                          <div className="text-xs text-gray-300 italic max-w-[120px] mx-auto">
                            {getDomainData(domain, category.key)[0]}
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Domain Details */}
        <AnimatePresence>
          {selectedDomain && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/10 p-6"
            >
              {(() => {
                const domain = domains.find((d) => d.id === selectedDomain)!;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <span>📋</span>
                        Full Description
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {domain.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <span>🎯</span>
                        All Expertise Areas
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {domain.expertise.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 border border-white/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <span>📊</span>
                        Key Metrics
                      </h4>
                      <div className="space-y-2">
                        {domain.keyMetrics.map((metric, metricIndex) => (
                          <div
                            key={metricIndex}
                            className="flex justify-between"
                          >
                            <span className="text-gray-400 text-sm">
                              {metric.label}:
                            </span>
                            <span
                              className="text-sm font-semibold"
                              style={{ color: domain.primaryColor }}
                            >
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DomainComparisonMatrix;
