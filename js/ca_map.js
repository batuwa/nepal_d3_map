var width = 960,
    height = 600;

var projection = d3.geo.albers()
    .center([87, 28])
    .rotate([-85, 0])
    .parallels([27, 32]);

var path = d3.geo.path()
    .projection(projection);

var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");


d3.json("data/nepal.json", function(error, npl) {
    var districts = topojson.feature(npl, npl.objects.nepal_districts);

    projection
      .scale(1)
      .translate([0, 0]);

    var b = path.bounds(districts),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
      .scale(s)
      .translate(t);

      g.selectAll(".nepal_districts")
          .data(districts.features)
        .enter().append("path")
          .attr("class", function(d) { return "nepal_districts " + d.id; })
          .attr("d", path)
          .on("mouseover", function(d,i) {
              d3.select(this.parentNode.appendChild(this)).transition().duration(300)
                  .style({'stroke-width':2,'stroke':'#333333','stroke-linejoin':'round','cursor':'pointer','fill':'#b9270b'});
          })
          .on("mouseout", function(d,i) {
              d3.select(this.parentNode.appendChild(this)).transition().duration(100)
                  .style({'stroke-width':2,'stroke':'#FFFFFF','stroke-linejoin':'round','fill':'#3d71b6'});
          });

      g.append("path")
          .datum(topojson.mesh(npl, npl.objects.nepal_districts, function(a, b) { return a !== b;}))
          .attr("d", path)
          .attr("class", "district-boundary");
});
