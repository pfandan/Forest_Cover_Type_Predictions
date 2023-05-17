// Function to calculate the color based on the value
function getColor(value) {
  if (value <= 0.25) {
    return '#00FF00'; // Green
  } else if (value <= 0.5) {
    return '#0000FF'; // Blue
  } else if (value <= 0.75) {
    return '#808080'; // Gray
  } else {
    return '#FF0000'; // Red
  }
}

// Function to create the heatmap visualization
function createHeatmap(data, xLabels, yLabels, title) {
  const heatmapContainer = document.getElementById('heatmap-container');

  // Clear the container
  while (heatmapContainer.firstChild) {
    heatmapContainer.removeChild(heatmapContainer.firstChild);
  }

  // Create the canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = data[0].length;
  const height = data.length;
  const rectSize = 30;

  canvas.width = width * rectSize;
  canvas.height = height * rectSize;

  // Draw the heatmap rectangles
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = data[y][x];
      const color = getColor(value);

      context.fillStyle = color;
      context.fillRect(x * rectSize, y * rectSize, rectSize, rectSize);
    }
  }

  // Add the canvas to the container
  heatmapContainer.appendChild(canvas);

  // Create the legend
  const legendContainer = document.createElement('div');
  legendContainer.className = 'legend';

  const legendLabels = [
    { label: 'Low', color: '#00FF00' },
    { label: 'Medium', color: '#0000FF' },
    { label: 'High', color: '#808080' },
    { label: 'Very High', color: '#FF0000' }
  ];

  for (const { label, color } of legendLabels) {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';

    const legendColor = document.createElement('span');
    legendColor.className = 'legend-color';
    legendColor.style.backgroundColor = color;

    const legendLabel = document.createElement('span');
    legendLabel.innerText = label;

    legendItem.appendChild(legendColor);
    legendItem.appendChild(legendLabel);
    legendContainer.appendChild(legendItem);
  }

  heatmapContainer.appendChild(legendContainer);
}

// Function to parse CSV data
function parseCSV(csvText) {
  const rows = csvText.trim().split('\n');
  const header = rows[0].split(',');

  const xLabels = header.slice(1, -1);
  const yLabels = [];
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(',');

    if (row.length === header.length) {
      yLabels.push(row[0]);

      const rowData = row.slice(1, -1).map(value => parseFloat(value));
      data.push(rowData);
    }
  }

  return { data, xLabels, yLabels };
}

// Load the CSV data and create the heatmap visualization
fetch('train.csv')
  .then(response => response.text())
  .then
  (csvText => {
    const { data, xLabels, yLabels } = parseCSV(csvText);
    createHeatmap(data, xLabels, yLabels, 'Cover_Type Heatmap');
  })
  .catch(error => console.log('Error:', error));