export var add_body, energyChart;
export function setEnergyVisibility(pt, kt, e) {
    energyChart.data.datasets[0].hidden = pt;
    energyChart.data.datasets[1].hidden = kt;
    energyChart.data.datasets[2].hidden = e;
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    for (let i = 0; i < chart.data.datasets.length; i++) {
        chart.data.datasets[i].data.push(data[i]);
    }
    chart.update();
}

function removeData(chart) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
}
var output;
var settings;
var chartUpdateFreq = 40;
var maxPnts = 80;
var updateCounter = 0;
var startingData = {
    labels: [0, chartUpdateFreq * 1, chartUpdateFreq * 2, chartUpdateFreq * 3, chartUpdateFreq * 4, chartUpdateFreq * 5, chartUpdateFreq * 6, chartUpdateFreq * 7, chartUpdateFreq * 8, chartUpdateFreq * 9, chartUpdateFreq * 10, chartUpdateFreq * 11, chartUpdateFreq * 12, chartUpdateFreq * 13, chartUpdateFreq * 14, chartUpdateFreq * 15, chartUpdateFreq * 16, chartUpdateFreq * 17],
    datasets: [{
            backgroundColor: "rgba(3,252,186, 0.5)",
            pointStrokeColor: "#fff",
            data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        },
        {
            backgroundColor: "rgba(252, 65, 3, 0.4)",
            pointStrokeColor: "#fff",
            data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

        },
        {
            backgroundColor: "rgba(23, 3, 252, 0.4)",
            pointStrokeColor: "#fff",
            data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        }
    ]
};

var canvas = document.getElementById("energyChart");
var ctx = canvas.getContext("2d");
energyChart = new Chart(ctx, {
    animationSteps: 0,
    type: "line",
    data: startingData,
});
energyChart.options.animation = false;
// Importing WASM as a JS module requires us to call an init function provided by the default export.
// This is planned to be changed in the future.
import {
    default as wasm,
    Body,
    Vec3f,
    Instance
} from "./pkg/web_rust_ray_marching.js";

wasm().then((module) => {
    var inst = Instance.new(Vec3f.new(1.0, 0.0, 0.0), Vec3f.new(0.0, 0.0, 1.0), 20, 1.0);

    add_body = function(xx, xy, xz, vx, vy, vz, r, m) {
        inst.add_body(Body.new(
            Vec3f.new(xx, xy, xz),
            Vec3f.new(vx, vy, vz),
            r,
            m));
    }

    add_body(0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 0.4, 6000.0);
    add_body(0.0, 1.3, 5.0, 0.9115, 0.0, 0.0, 0.2, 15.0);
    add_body(0.0, -1.5, 5.0, -0.9115, 0.0, 0.0, 0.3, 30.0);
    //add_body(1.7, 0.0, 5.0, 0.0, 0.9115, 0.0, 0.2, 20.0);

    var out = document.getElementById("out");
    var data = document.getElementById("data");

    var push_box = document.getElementById("push");

    // Setup chart


    var i = setInterval(function() {
        inst.update();
        out.innerHTML = inst.screen_out();
        let pt = inst.potential_energy();
        let kt = inst.kinetic_energy();
        let e = pt + kt;
        pt = pt.toPrecision(3);
        kt = kt.toPrecision(3);
        e = e.toPrecision(3);

	if (push_box) {
		if (push_box.checked == true)
			inst.bodies[1].force(Vec3f.new(1.0, 1.0, 0.0));
	}
	
        data.innerHTML = "Potential Energy: " + pt + "<br>Kinetic Energy: " + kt + "<br>Total Energy: " + e + "<br>";
        if (updateCounter % chartUpdateFreq == 0) {
            addData(energyChart, chartUpdateFreq * 18 + updateCounter, [pt, kt, e]);
            if (energyChart.data.datasets[0].data.length > maxPnts) {
                removeData(energyChart);
            }
        }
        updateCounter++;
    }, 2);


    // The boiler plate project comes with a `greet` function that calls:
    // `alert("Hello, hello-wasm!");`
});
