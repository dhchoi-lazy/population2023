const pymChild = new pym.Child();
const width = 1000;
const height = 570;
const years = ["default", 1966, 1980, 1990, 2000, 2010, 2020, 2023];
const svg = d3.select("svg");
const dur = 400;
const pathn = d3.geo.path().projection(null);
const scaleFactorX = 1;
const normalizationFactor = 0.05;
const baseOffsetX = -660;
const scaleMultiplierY = 120;
const baseOffsetY = -2500;
const upperLimit = 179.999;
const projection = d3.geo
  .mercator()
  .center([128, 36])
  .scale(3000)
  .translate([width / 2, height / 2]);

loadAndInitializeMap(d3.select("svg"), years);

function map_shift(n, initmap, polygon) {
  d3.selectAll(".circle")
    .transition()
    .duration(500)
    .style("fill", "rgb(80,80,255)")
    .attr("r", 20);

  d3.select(".circle" + n)
    .transition()
    .duration(500)
    .style("fill", "orange")
    .attr("r", 24);

  map_transition(n, initmap, polygon);
  console.log("mapshift_polygon", polygon);
}

function map_transition(n, p, polygon) {
  d3.csv(
    "../components/offset/offset" + years[n - 1] + ".csv",
    function (error, shift1) {
      if (error) {
        console.error("Error loading CSV:", error);
        return;
      }

      const polygon2 = JSON.parse(JSON.stringify(polygon));
      polygon2.features.forEach((feature, k) => {
        feature.geometry.coordinates[0] = modifypoly(
          feature.geometry.coordinates[0],
          shift1,
          n - 1
        ).map(projection);
      });

      p.data(polygon2.features).transition().duration(dur).attr("d", pathn);
    }
  );
}

function createButtons(svg, years, initmap, polygon) {
  svg
    .selectAll("g")
    .data([1, 2, 3, 4, 5, 6, 7, 8])
    .enter()
    .append("g")
    .each(function (d) {
      d3.select(this)
        .append("text")
        .attr("x", 900)
        .attr("y", 80 * (d + 1) - 120) // subtract 20 to move text up
        .text(years[d - 1])
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "red");

      d3.select(this)
        .append("circle")
        .attr("class", "circle circle" + d)
        .attr("r", 20)
        .attr("cx", 900)
        .attr("cy", 80 * (d + 1) - 100)
        .on("click", () => map_shift(d, initmap, polygon));
    });
}

function loadAndInitializeMap(svg, years) {
  d3.json("../components/korea_map3_optimized.geojson", function (polygon) {
    const initpolygon = JSON.parse(JSON.stringify(polygon));
    initpolygon.features.forEach((feature) => {
      feature.geometry.coordinates[0] =
        feature.geometry.coordinates[0].map(projection);
    });

    const initmap = svg
      .selectAll("path")
      .data(initpolygon.features)
      .enter()
      .append("path")
      .attr("d", pathn)
      .style("stroke", "white")
      .style("stroke-width", 0.6);

    createButtons(svg, years, initmap, polygon);
  });
}

function modifypoly(polyline, shift, delta) {
  console.log(polyline);
  const l1 = polyline.map(([x, y]) => [+x, +y]);
  const len = l1.length;
  const resultarr = [];

  const xinterp = d3.scale.linear();
  const yinterp = d3.scale.linear();

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
    const xintermed1 = xinterp((l1[j][0] * scaleFactorX) / normalizationFactor);

    xinterp.range([
      shift[x1y2]["dx" + String(years[delta])],
      shift[x2y2]["dx" + String(years[delta])],
    ]);
    const xintermed2 = xinterp((l1[j][0] * scaleFactorX) / normalizationFactor);

    xinterp.range([
      shift[x1y1]["dy" + String(years[delta])],
      shift[x2y1]["dy" + String(years[delta])],
    ]);
    const yintermed1 = xinterp((l1[j][0] * scaleFactorX) / normalizationFactor);

    xinterp.range([
      shift[x1y2]["dy" + String(years[delta])],
      shift[x2y2]["dy" + String(years[delta])],
    ]);
    const yintermed2 = xinterp((l1[j][0] * scaleFactorX) / normalizationFactor);

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
