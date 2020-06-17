import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const UpVoteChart = (props) => {
  const chart = () => {
    let votes = [];
    let id = [];

        for (const dataObj of props.data) {
          votes.push(parseInt(dataObj.points));
          id.push(parseInt(dataObj.objectID));
        }
        let chartData = {
          labels: id,
          datasets: [
            {
              label: "Votes",
              data: votes,
              borderWidth: 4
            }
          ]
        };
    return chartData;
  };

  return (
    <div className="App">
      <div>
        <Line
          data={chart}
          options={{
            responsive: true
          }}
        />
      </div>
    </div>
  );
};

export default UpVoteChart;
