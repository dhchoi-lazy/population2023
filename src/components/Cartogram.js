import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { geoPath, geoMercator } from "d3-geo";
import cloneDeep from "lodash/cloneDeep";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import koreaMap from "./korea_map.geojson";
import offset1966 from "./offset/offset1966.csv";
import offset1980 from "./offset/offset1980.csv";
import offset1990 from "./offset/offset1990.csv";
import offset2000 from "./offset/offset2000.csv";
import offset2010 from "./offset/offset2010.csv";
import offset2020 from "./offset/offset2020.csv";
import offset2023 from "./offset/offset2023.csv";
import offsetdefault from "./offset/offsetdefault.csv";
const offsetData = {
  default: offsetdefault,
  1966: offset1966,
  1980: offset1980,
  1990: offset1990,
  2000: offset2000,
  2010: offset2010,
  2020: offset2020,
  2023: offset2023,
};

const Cartogram = ({ bgColor }) => {
  const width = 1200;
  const height = 800;
  const years = ["default", 1966, 1980, 1990, 2000, 2010, 2020, 2023];
  const dur = 400;
  const scaleFactorX = 1;
  const normalizationFactor = 0.05;
  const baseOffsetX = -660;
  const scaleMultiplierY = 120;
  const baseOffsetY = -2500;
  const upperLimit = 179.999;
  const projection = geoMercator()
    .center([128, 36])
    .scale(6000)
    .translate([width / 2, height / 2]);
  const pathn = geoPath().projection(null);
  const svgRef = useRef();

  const [polygon, setPolygon] = useState(null);
  const [projectedPolygon, setprojectedPolygon] = useState(null);
  const [sliderValue, setSliderValue] = React.useState(0); // Assuming 0 as default value
  const marks = years.map((year, index) => ({
    value: index,
    label: year.toString(),
  }));

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    mapShift(newValue); // Assuming 'mapShift' can handle the index directly
  };

  useEffect(() => {
    d3.json(koreaMap).then((data) => {
      const initPolygon = JSON.parse(JSON.stringify(data));
      const iPolygon = cloneDeep(initPolygon);
      setPolygon(iPolygon);
      initPolygon.features.forEach((feature) => {
        feature.geometry.coordinates[0] =
          feature.geometry.coordinates[0].map(projection);
      });
      setprojectedPolygon(initPolygon);
      createButtons();
    });
  });
  function modifypoly(polyline, shift, delta) {
    const l1 = polyline.map(([x, y]) => [+x, +y]);
    const len = l1.length;
    const xinterp = d3.scaleLinear();
    const yinterp = d3.scaleLinear();

    for (let j = 0; j < len; j++) {
      const x1y1 = calculateValue(
        l1[j][0],
        l1[j][1],
        scaleFactorX,
        normalizationFactor,
        baseOffsetX,
        scaleMultiplierY,
        baseOffsetY
      );
      const x1y2 = calculateValue(
        l1[j][0],
        l1[j][1],
        scaleFactorX,
        normalizationFactor,
        baseOffsetX + 1,
        scaleMultiplierY,
        baseOffsetY
      );
      const x2y1 = calculateValue(
        l1[j][0],
        l1[j][1],
        scaleFactorX,
        normalizationFactor,
        baseOffsetX,
        scaleMultiplierY,
        baseOffsetY + 1
      );
      const x2y2 = calculateValue(
        l1[j][0],
        l1[j][1],
        scaleFactorX,
        normalizationFactor,
        baseOffsetX + 1,
        scaleMultiplierY,
        baseOffsetY + 1
      );

      xinterp
        .domain([
          Math.floor((l1[j][0] * scaleFactorX) / normalizationFactor),
          Math.floor((l1[j][0] * scaleFactorX) / normalizationFactor) + 1,
        ])
        .range([
          shift[x1y1]["dx" + String(years[delta])],
          shift[x2y1]["dx" + String(years[delta])],
        ]);
      const xintermed1 = xinterp(
        (l1[j][0] * scaleFactorX) / normalizationFactor
      );

      xinterp.range([
        shift[x1y2]["dx" + String(years[delta])],
        shift[x2y2]["dx" + String(years[delta])],
      ]);
      const xintermed2 = xinterp(
        (l1[j][0] * scaleFactorX) / normalizationFactor
      );

      xinterp.range([
        shift[x1y1]["dy" + String(years[delta])],
        shift[x2y1]["dy" + String(years[delta])],
      ]);
      const yintermed1 = xinterp(
        (l1[j][0] * scaleFactorX) / normalizationFactor
      );

      xinterp.range([
        shift[x1y2]["dy" + String(years[delta])],
        shift[x2y2]["dy" + String(years[delta])],
      ]);
      const yintermed2 = xinterp(
        (l1[j][0] * scaleFactorX) / normalizationFactor
      );

      yinterp
        .domain([
          Math.floor((l1[j][1] * scaleFactorX) / normalizationFactor),
          Math.floor((l1[j][1] * scaleFactorX) / normalizationFactor) + 1,
        ])
        .range([xintermed1, xintermed2]);
      const xfinal = +yinterp((l1[j][1] * scaleFactorX) / normalizationFactor);

      yinterp.range([yintermed1, yintermed2]);
      const yfinal = +yinterp((l1[j][1] * scaleFactorX) / normalizationFactor);

      l1[j][0] += xfinal;
      l1[j][1] += yfinal;

      if (l1[j][0] > 180) {
        l1[j][0] = upperLimit;
      }
      if (l1[j][1] > 180) {
        l1[j][1] = upperLimit;
      }
      if (l1[j][0] > 180) {
        l1[j][0] = upperLimit;
      }
      if (l1[j][1] > 180) {
        l1[j][1] = upperLimit;
      }
    }

    return l1;
  }

  function calculateValue(
    x,
    y,
    scaleFactorX,
    normalizationFactor,
    baseOffsetX,
    scaleMultiplierY,
    baseOffsetY
  ) {
    return (
      (Math.floor((y * scaleFactorX) / normalizationFactor) + baseOffsetX) *
        scaleMultiplierY +
      Math.floor((x * scaleFactorX) / normalizationFactor) +
      baseOffsetY
    );
  }

  const mapTransition = (n, polygonData) => {
    if (!polygonData) {
      console.error("Polygon data is not available.");
      return;
    }

    // Ensure the correct year is being used
    const currentYear = years[n];
    const filePath = offsetData[currentYear];

    d3.csv(filePath).then((shiftData) => {
      const modifiedPolygon = JSON.parse(JSON.stringify(polygonData));
      modifiedPolygon.features.forEach((feature, k) => {
        feature.geometry.coordinates[0] = modifypoly(
          feature.geometry.coordinates[0],
          shiftData,
          n
        );
        feature.geometry.coordinates[0] =
          feature.geometry.coordinates[0].map(projection);
      });

      d3.selectAll("path")
        .data(modifiedPolygon.features)
        .transition()
        .duration(dur) // Duration of the transition in milliseconds
        .attr("d", (d) => pathn(d));
    });
  };

  // Function to handle map shift
  const mapShift = (n) => {
    mapTransition(n, polygon);
  };

  // Function to create buttons
  const createButtons = () => {
    const svg = d3.select(svgRef.current);
    svg
      .selectAll("g")
      .data([1, 2, 3, 4, 5, 6, 7, 8])
      .enter()
      .append("g")
      .each(function (d) {
        d3.select(this)
          .append("text")
          .attr("x", 900)
          .attr("y", 80 * (d + 1) - 120)
          .text(years[d - 1])
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .attr("fill", "red");
      });
  };
  document.body.style.backgroundColor = bgColor;
  const contraryColor = bgColor === "black" ? "white" : "black";
  // const metroColor = bgColor === "black" ? "black" : "#DCBFFF";
  const strokeColor = bgColor === "black" ? "white" : "black";

  return (
    <div>
      {projectedPolygon ? (
        <svg width={width} height={height}>
          {projectedPolygon.features.map((feature, i) => (
            <path
              key={i}
              d={pathn(feature)}
              style={{
                stroke: strokeColor,
                strokeWidth: 0.8,
                fill: feature.properties.metro ? bgColor : bgColor,
              }}
            />
          ))}
        </svg>
      ) : (
        <p>Loading map...</p>
      )}
      <div className="yearSlider" style={{ marginTop: "10vh" }}>
        <Box sx={{ width: 300 }} style={{ margin: "0 auto", width: "50%" }}>
          <Slider
            sx={{
              "& .MuiSlider-thumb": {
                color: contraryColor,
              },
              "& .MuiSlider-track": {
                color: "grey",
              },
              "& .MuiSlider-rail": {
                color: "grey",
              },

              "& .MuiSlider-markLabel": {
                color: contraryColor,
              },
            }}
            value={sliderValue}
            onChange={handleSliderChange}
            min={0}
            max={years.length - 1}
            step={1}
            marks={marks}
            valueLabelDisplay="auto" // Shows the label of the current value
            aria-labelledby="year-slider"
            valueLabelFormat={function (value) {
              return years[value];
            }}
          />
        </Box>
      </div>
    </div>
  );
};

export default Cartogram;
