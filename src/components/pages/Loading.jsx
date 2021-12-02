import React from "react";
import loadingGif from "../../img/loading.gif"

const Loading = (props) => {

    return (
      <div className={"loading " + (props.open && "active")}>
        <img src={loadingGif} alt="gif" />
      </div>
    );
};

export default Loading;