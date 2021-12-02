import React from "react";


const TitlesItem = (props) => {

  return (
    <div className="info">
      {props.info[0]}
        <div className="delete" onClick={() => 
           props.action.handleParentFun(props.info[3])
      }>
        Šalinti
      </div>
    </div>
  );
};

export default TitlesItem;
