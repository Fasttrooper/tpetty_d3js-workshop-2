// Convert the Observable block into a standard JavaScript function
function createChart(data) {
    const width = 954;
    const radius = width / 2;

    const tree = d3.cluster()
        .size([2 * Math.PI, radius - 100]);

    const root = tree(bilink(d3.hierarchy(data)
        .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", width)
        .attr("viewBox", [-width / 2, -width / 2, width, width])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const node = svg.append("g")
        .selectAll()
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
        .append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.x < Math.PI ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
        .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
        .text(d => d.data.name)
        .each(function (d) { d.text = this; })
        .on("mouseover", overed)
        .on("mouseout", outed)
        // UPDATE: Adjusted the tooltip to show Airport code, Region, and route counts
        .call(text => text.append("title").text(d => 
            `${d.data.name} (${d.parent.data.name})\nIncoming routes: ${d.incoming.length}\nOutgoing routes: ${d.outgoing.length}`
        ));

    const line = d3.lineRadial()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x);

    const link = svg.append("g")
        .attr("stroke", colornone)
        .attr("fill", "none")
        .selectAll()
        .data(root.leaves().flatMap(leaf => leaf.outgoing))
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", ([i, o]) => line(i.path(o)))
        .each(function (d) { d.path = this; });

    // UPDATE: Hover logic highlights connected links using the defined airline colors
    function overed(event, d) {
        link.style("mix-blend-mode", null);
        d3.select(this).attr("font-weight", "bold").attr("fill", "black");

        // Highlight incoming links and text
        d3.selectAll(d.incoming.map(d => d.path))
            .attr("stroke", linkData => airlineColor[linkData[2]] || "#888") // fallback color if airline isn't in mapping
            .attr("stroke-width", 2)
            .raise();
        d3.selectAll(d.incoming.map(([sourceNode]) => sourceNode.text))
            .attr("fill", "black")
            .attr("font-weight", "bold");

        // Highlight outgoing links and text
        d3.selectAll(d.outgoing.map(d => d.path))
            .attr("stroke", linkData => airlineColor[linkData[2]] || "#888")
            .attr("stroke-width", 2)
            .raise();
        d3.selectAll(d.outgoing.map(([, targetNode]) => targetNode.text))
            .attr("fill", "black")
            .attr("font-weight", "bold");
    }

    // UPDATE: Unhover logic resets everything back to standard
    function outed(event, d) {
        link.style("mix-blend-mode", "multiply");
        d3.select(this).attr("font-weight", null).attr("fill", null);

        // Reset incoming links and text
        d3.selectAll(d.incoming.map(d => d.path))
            .attr("stroke", null)
            .attr("stroke-width", null);
        d3.selectAll(d.incoming.map(([sourceNode]) => sourceNode.text))
            .attr("fill", null)
            .attr("font-weight", null);

        // Reset outgoing links and text
        d3.selectAll(d.outgoing.map(d => d.path))
            .attr("stroke", null)
            .attr("stroke-width", null);
        d3.selectAll(d.outgoing.map(([, targetNode]) => targetNode.text))
            .attr("fill", null)
            .attr("font-weight", null);
    }

    return svg.node();
}