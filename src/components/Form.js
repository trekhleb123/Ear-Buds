import React, { useState } from "react";
import { connect } from "react-redux";
import { firestore, findRoom, addMessage } from "../firebase/firebase";
import firebase from "firebase";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";

const Form = (props) => {
  const initialItemValues = {
    name: props.userData.display_name,
    message: "",
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
    <div>
      <form onSubmit={onSubmit} autocomplete="off" id="message-form">
        <TextField
          name="message"
          placeholder="Message"
          value={item.message}
          onChange={onChange}
          style={{ width: "100%" }}
        />
        <Button type="submit" variant="outlined" style={{ margin: "5px" }}>
          Send
        </Button>
      </form>
    </div>
  );
};

const stateToProps = (state) => ({
  userData: state.userData,
  roomCode: state.roomCode,
});

export default connect(stateToProps, null)(Form);
