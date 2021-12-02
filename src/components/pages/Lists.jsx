import React from "react";
import ListItem from "./ListItem.jsx"

const Lists = (props) => {

  let data = props.list.content;

    return (
      <div className="lists">
        <div className="title">{props.list.title}</div>
        {data.map(link =>
          <ListItem data={link} key={link}/>
        )}
      </div>
    );
};

export default Lists;