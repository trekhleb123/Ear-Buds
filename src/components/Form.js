import React, { useState } from "react";
import { connect } from "react-redux";
import { firestore, findRoom, addMessage } from "../firebase/firebase";

const Form = (props) => {
  const initialItemValues = {
    name: props.userData.display_name,
    message: "",
    timestamp: new Date(),
  };
  const [item, setItem] = useState(initialItemValues);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (props.roomCode) {
      addMessage(props.roomCode, item).then(() => setItem(initialItemValues));
    }
  };

  const onChange = ({ target }) => {
    setItem({
      ...item,
      [target.name]: target.value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        name="message"
        placeholder="Message"
        value={item.message}
        onChange={onChange}
      />
      <button type="submit">Send</button>
    </form>
  );
};

const stateToProps = (state) => ({
  userData: state.userData,
  roomCode: state.roomCode,
});

export default connect(stateToProps, null)(Form);
