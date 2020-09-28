import React from 'react';
import {
    Card,
    CardContent,
    Typography,
  } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({title,cases, total, active, isRed, ...props}) {
    return (
        <Card
      onClick={props.onClick}
      className={`infoBox ${active && title==="Corovirus Cases" && "infoBox--selected--red"} ${active && title==="Recovered" && "infoBox--selected"} ${active && title==="Deaths" && "infoBox--selected--red"} ${
        isRed && "infoBox--red" 
      }`}
    >
            <CardContent className="infoBox__content">
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox
