import React, { useRef } from "react";

const Form = (props) => {


   const inputValue = useRef()

   const dataForm = (e) => {
      e.preventDefault();
      props.show(false)

      const data = {
         title: `${inputValue.current.value}`,
         content: props.in
      }

      props.list(data)
   }

  return (
    <form onSubmit={dataForm}>
      <input type="text" ref={inputValue} placeholder="Sąrašo pavadinimas" />
      <input className="btn" type="submit" value="Pridėti" />
    </form>
  );
};

export default Form;
