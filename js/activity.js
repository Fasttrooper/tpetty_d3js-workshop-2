// Create a floating HTML tooltip div
const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("pointer-events", "none") // Prevents the tooltip from blocking mouse events
    .style("opacity", 0)
    .style("background", "rgba(255, 255, 255, 0.95)")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("padding", "8px")
    .style("font", "12px sans-serif")
    .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)");

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

    const line = d3.lineRadial()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x);

    // Draw the links
    const link = svg.append("g")
        .selectAll("path")
        .data(root.leaves().flatMap(leaf => leaf.outgoing))
        .join("path")
        .attr("fill", "none")
        .attr("stroke", d => airlineColor[d[2]] || colornone)
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.2) // Set a lower default opacity so hovers pop out
        .attr("d", ([i, o]) => line(i.path(o)));

    // Draw the nodes
    const node = svg.append("g")
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("dy", "0.31em")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) ${d.x >= Math.PI ? "rotate(180)" : ""}`)
        .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
        .text(d => d.data.name)
        .style("cursor", "pointer")
        // NEW: Map our new mouse events
        .on("mouseenter", overed)
        .on("mousemove", moved)
        .on("mouseleave", outed);

    // --- HOVER LOGIC ---
    function overed(event, d) {
        // 1. Create Sets to store connected items
        const connectedNodes = new Set([d]); // Add the hovered node immediately
        const connectedLinks = new Set();

        // 2. Populate Sets with incoming/outgoing connections
        d.incoming.forEach(route => {
            connectedNodes.add(route[0]);
            connectedLinks.add(route);
        });
        d.outgoing.forEach(route => {
            connectedNodes.add(route[1]);
            connectedLinks.add(route);
        });

        // 3. Update ALL nodes based on whether they are in the Set
        node.attr("font-weight", n => connectedNodes.has(n) ? "bold" : "normal")
            .attr("fill", n => n === d ? "black" : connectedNodes.has(n) ? "#333" : "#ccc"); // Hovered node is black, connected are dark grey, rest fade

        // 4. Update ALL links based on whether they are in the Set
        link.attr("stroke-opacity", route => connectedLinks.has(route) ? 1 : 0.05)
            .attr("stroke-width", route => connectedLinks.has(route) ? 2.5 : 1);

        // 5. Populate and show the HTML tooltip
        tooltip.style("opacity", 1)
            .html(`
                <strong>${d.data.name}</strong> (${d.parent.data.name})<br/>
                Incoming routes: ${d.incoming.length}<br/>
                Outgoing routes: ${d.outgoing.length}
            `);
        moved(event); // Call moved immediately to position it
    }

    // --- TOOLTIP MOVEMENT LOGIC ---
    function moved(event) {
        // Position the tooltip slightly offset from the cursor
        tooltip.style("left", (event.pageX + 15) + "px")
               .style("top", (event.pageY + 15) + "px");
    }

    // --- UNHOVER LOGIC ---
    function outed() {
        // 1. Reset nodes to default
        node.attr("font-weight", "normal")
            .attr("fill", "black");

        // 2. Reset links to default
        link.attr("stroke-opacity", 0.2)
            .attr("stroke-width", 1.5);

        // 3. Hide the tooltip
        tooltip.style("opacity", 0);
    }

    return svg.node();
}