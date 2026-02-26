# D3.js Workshop 2

## Getting Started

### 1. Fork this repository
Click the **Fork** button in the top-right corner of this GitHub page. This creates your own personal copy of the workshop materials under your GitHub account - all your changes will be saved there.

### 2. Clone your fork
Once you've forked it, clone **your fork** (not the original) to your local machine. Copy the URL from your forked repo and run:
```bash
git clone https://github.com/YOUR-USERNAME/d3js-workshop-2.git
```
Then navigate into the folder:
```bash
cd d3js-workshop-2
```

### 3. Open in VS Code
Open the project folder in VS Code.

### 4. Install the Live Server extension
D3 loads data files using `fetch`, which requires a local server — opening the HTML file directly in your browser will not work due to browser security restrictions.

In VS Code, go to the Extensions panel and search for **Live Server** by Ritwick Dey. Install it.

### 5. Launch Live Server
For the class demo:  
Right-click on `demo.html` in the VS Code file explorer and select **Open with Live Server**.

For the class activity:  
Right-click on `index.html` in the VS Code file explorer and select **Open with Live Server**.

### 6. Working Documents
For the class demo:  
We will be coding in parallel in `js/demo.js` to learn how we can run examples from D3 gallery locally.

For the class activity:  
After the demo you will be asked to complete the TODO steps in `js/activity.js` to apply the concepts. We will grade your code from this file.

---

## Activity Requirements

Your task is to adapt the hierarchical edge bundling visualization from the [D3 Observable notebook](https://observablehq.com/@d3/hierarchical-edge-bundling) using airport route data.

Complete the following in `js/activity.js`:

**1. Adapt Chart Definition Code**  
Copy the chart definition code from the demo into `js/activity.js`` and integrate it with the existing setup code already provided in the file.

**2. Hover and Unhover Interactions**  
Update the logic for hover and unhover states:
- **On hover:** highlight the hovered node and all directly connected nodes and links (incoming and outgoing).
- **On unhover:** return all nodes and links to their default state.

**3. Tooltip**  
Update the tooltip to display for the focused airport:
- Airport code and region
- Number of incoming routes
- Number of outgoing routes

---

## Saving Your Work
As you complete the TODO exercises, commit and push your changes to your fork:
```bash
git add .
git commit -m "your message here"
git push
```

---

## Deployment
Once your activity is complete, deploy your project using **GitHub Pages**:

1. Go to your forked repository on GitHub → **Settings** → **Pages**.
2. Under **Source**, select the `main` branch and `/ (root)` folder, then click **Save**.
3. Your site will be live at `https://YOUR-USERNAME.github.io/d3js-workshop-2/`.

Submit the link to your deployed GitHub Pages site.