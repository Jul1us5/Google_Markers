import React, { useRef, useState } from "react";
import TitlesItem from "./TitlesItem.jsx";
import Loading from "./Loading.jsx";
import Form from "./Form.jsx";


const Titles = (props) => {

  const [show, setShow] = useState(false);

  const addName = useRef();


  const addList = () => {

    setShow(true)
  }

    return (
      <div className="titles" id="show">
        <div className="count">{props.data.length}</div>
        {props.data.map(link =>
          <TitlesItem info={link} key={link} action={props}/>
        )}
        <div className="create" ref={addName} onClick={addList}>Pridėti į sąrašą
          { show ? <Form show={setShow} list={props.show} in={props.data} /> : null}
        </div>
        <Loading open={props.empty}/>
      </div>
    );
};

export default Titles;