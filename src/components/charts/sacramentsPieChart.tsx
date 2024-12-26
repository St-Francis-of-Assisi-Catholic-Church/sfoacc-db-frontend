"use client";
import dynamic from "next/dynamic";
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

const SacramentsPieChart = () => {
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      left: "center",
      bottom: "bottom",
      type: "scroll",
      textStyle: {
        fontSize: 12,
      },
      pageTextStyle: {
        color: "#888",
      },
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
      // right: 10,
      // top: 10,
    },
    series: [
      {
        name: "Church Sacraments",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}: {d}%",
          fontSize: 12,
          alignTo: "edge",
          edgeDistance: "10%",
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80,
        },
        labelLayout: {
          hideOverlap: true,
        },
        data: [
          { value: 44, name: "Baptism" },
          { value: 55, name: "First Communion" },
          { value: 13, name: "Confirmation" },
          { value: 43, name: "Holly Orders" },
          { value: 22, name: "No Sacrament" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        color: ["#2563eb", "#0891b2", "#16a34a", "#d97706", "#6b7280"],
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "400px", width: "100%" }}
      opts={{ renderer: "canvas" }}
    />
  );
};

export default SacramentsPieChart;
