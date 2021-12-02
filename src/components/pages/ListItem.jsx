import React, { createRef } from "react";

const ListItem = (props) => {

   const wrp = createRef();

   const callColor = () => {

      wrp.current.classList.add('active')
   }

    return (
       <div className="wrap" ref={wrp} onClick={callColor}>
          {props.data[0]}
      </div>
    );
};

export default ListItem;