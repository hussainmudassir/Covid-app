import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral, { set } from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType, countryName) => {
  let chartData = [];
  let lastDataPoint;
  let dataToLoop;
  let data1;
  if (countryName !== "worldwide") {
    dataToLoop = data.timeline.cases;
    data1=data.timeline;
  } 
  else {
    dataToLoop = data.cases;
    data1=data;
  }
  
  for (let date in dataToLoop) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data1[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data1[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType, countryName } ) {
  const [data, setData] = useState({});
  // console.log(countryName);
  useEffect(() => {
    const fetchData = async () => {
      let url = countryName ? "https://disease.sh/v3/covid-19/historical/" + countryName + "?lastdays=30" : "https://disease.sh/v3/covid-19/historical/all?lastdays=60"
      console.log(url);
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if(data.message === "Country not found or doesn't have any historical data") 
            setData( [{
              x:0,
              y:0
            }]);
          else {
          console.log("yeh hai data " + data)
          let chartData = buildChartData(data, casesType, countryName);
          setData(chartData);
          console.log(chartData);
          }
        });
    };

    fetchData(countryName);
  }, [casesType, countryName]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(255, 99, 132, 0.3)",
                borderColor: "rgba(255, 99, 132, 1)",
                fill: false,
                borderWidth: 2,
                data: data,
              },
            ],
          }}
          options={options}
          height={250}
        />
      )}
    </div>
  );
}

export default LineGraph;
