const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const finalValue = document.getElementById('final-value');
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
	{ minDegree: 0, maxDegree: 30, value: 2 },
	{ minDegree: 31, maxDegree: 90, value: 1 },
	{ minDegree: 91, maxDegree: 150, value: 6 },
	{ minDegree: 151, maxDegree: 210, value: 5 },
	{ minDegree: 211, maxDegree: 270, value: 4 },
	{ minDegree: 271, maxDegree: 330, value: 3 },
	{ minDegree: 331, maxDegree: 360, value: 2 },
];
//Size of each piece
const data = [16, 16, 16, 16, 16, 16];
//background color for each piece
var pieColors = [
	'#e27396',
	'#ea9ab2',
	'#e27396',
	'#ea9ab2',
	'#e27396',
	'#ea9ab2',
];
const isMobile = window.innerWidth <= 768;
//Create chart
let myChart = new Chart(wheel, {
	//Plugin for displaying text on pie chart
	plugins: [ChartDataLabels],
	//Chart Type Pie
	type: 'pie',
	data: {
		//Labels(values which are to be displayed on chart)
		labels: [
			'Coba ingat hal lucu minggu ini',
			'Kirim Sticker random ke aku',
			'PAP Sekarang',
			'Tanya apa aja ke aku',
			'Bikin wajah paling jelek kamu',
			'Dibolehin curhat bebas',
		],
		//Settings for dataset/pie
		datasets: [
			{
				backgroundColor: pieColors,
				data: data,
			},
		],
	},
	options: {
		//Responsive chart
		responsive: true,
		animation: { duration: 0 },
		plugins: {
			//hide tooltip and legend
			tooltip: false,
			legend: {
				display: false,
			},
			//display labels inside pie chart
			datalabels: {
				color: '#ffffff',
				font: context => ({
					size: isMobile ? 10 : 13,
					weight: 'bold',
				}),
				formatter: (value, context) => {
					const label = context.chart.data.labels[context.dataIndex];
					if (isMobile && label.length > 25) {
						return label.slice(0, 25) + '...';
					}
					return label;
				},
				anchor: isMobile ? 'center' : 'end',
				align: isMobile ? 'center' : 'end',
				offset: isMobile ? 0 : -20,
				rotation: context => {
					const meta = context.chart.getDatasetMeta(0);
					const arc = meta.data[context.dataIndex];
					const start = arc.startAngle;
					const end = arc.endAngle;
					const midAngle = (start + end) / 2;
					return (midAngle * 180) / Math.PI;
				},
				clip: false,
			},
		},
	},
});
//display value based on the randomAngle
const valueGenerator = angleValue => {
	for (let i of rotationValues) {
		//if the angleValue is between min and max then display it
		if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
			const labelIndex = i.value - 1;
			const label = myChart.data.labels[labelIndex];
			finalValue.innerHTML = `<p>Kamu dapat: <strong>${label}</strong></p>`;
			spinBtn.disabled = false;
			break;
		}
	}
};
//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener('click', () => {
	spinBtn.disabled = true;
	//Empty final value
	finalValue.innerHTML = `<p>Good Luck!</p>`;
	//Generate random degrees to stop at
	let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
	//Interval for rotation animation
	let rotationInterval = window.setInterval(() => {
		//Set rotation for piechart
		/*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
		myChart.options.rotation = myChart.options.rotation + resultValue;
		//Update chart with new value;
		myChart.update();
		//If rotation>360 reset it back to 0
		if (myChart.options.rotation >= 360) {
			count += 1;
			resultValue -= 5;
			myChart.options.rotation = 0;
		} else if (count > 15 && myChart.options.rotation == randomDegree) {
			valueGenerator(randomDegree);
			clearInterval(rotationInterval);
			count = 0;
			resultValue = 101;
		}
	}, 10);
});
