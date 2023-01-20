import React, { useRef } from "react";

export default function Timer(props) {
  const [seconds, setSeconds] = React.useState(15);
  let interval = useRef();

  // everytime current user changes - resets timer
  React.useEffect(() => {
    setSeconds(15);
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
  }, [props.currentPlayer]);

  // when time reaches 0 - changes player. Also changes state of "change" to enable CPU move
  React.useEffect(() => {
    if (seconds === -1) {
      props.setCurrentPlayer((prevPlayer) => {
        return prevPlayer === "player-1" ? "player-2" : "player-1";
      });

      props.setChange((prevChange) => !prevChange);
    }
  }, [seconds]);

  // when menu or restart buttons is clicked - modal pops up and pauses timer
  React.useEffect(() => {
    // stops timer
    if (!props.modal.restarted && props.modal.display) {
      clearInterval(interval.current);
    }

    // sets timer again with remaining "seconds"
    if (!props.modal.restarted && !props.modal.display) {
      clearInterval(interval.current);
      interval.current = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }

    // resets timer and modal if confirmed to restart the game
    if (props.modal.restarted) {
      setSeconds(15);
      props.setModal((prevModal) => {
        return {
          ...prevModal,
          restarted: false,
        };
      });
    }
  }, [props.modal]);

  return seconds;
}
