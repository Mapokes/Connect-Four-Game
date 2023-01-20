import React from "react";
import Logo from "./Logo";

export default function Menu(props) {
  const [rulesDisplay, setRulesDisplay] = React.useState(false);

  /**Menu component "click" event handling */
  function handleClick(e) {
    const button = e.currentTarget.id;

    // shows rules
    if (button === "rules-btn") {
      setRulesDisplay(true);
    }

    // closes rules
    else if (button === "close-btn") {
      setRulesDisplay(false);
    }

    // display for Player vs CPU or PVP
    else if (button === "pvc-btn" || button === "pvp-btn") {
      props.setDisplay({
        menu: false,
        game: true,
        gameType: button === "pvc-btn" ? "pvc" : "pvp",
      });
    }
  }

  return (
    <section className="section-menu">
      <Logo />
      <button id="pvc-btn" className="menu--button pvc" onClick={handleClick} disabled={rulesDisplay ? true : false}>
        PLAY VS CPU{" "}
        <div className="pvc--icons-container">
          <i className="fa-regular fa-face-smile front-icon"></i>
          <i className="fa-regular fa-face-meh-blank back-icon"></i>
        </div>
      </button>
      <button id="pvp-btn" className="menu--button pvp" onClick={handleClick} disabled={rulesDisplay ? true : false}>
        PLAY VS PLAYER{" "}
        <div className="pvp--icons-container">
          <i className="fa-regular fa-face-smile-beam front-icon"></i>
          <i className="fa-regular fa-face-smile-beam back-icon"></i>
        </div>
      </button>
      <button
        id="rules-btn"
        className="menu--button rules"
        onClick={handleClick}
        disabled={rulesDisplay ? true : false}
      >
        GAME RULES
      </button>

      {rulesDisplay && (
        <div className="section-menu--rules">
          <h1 className="rules--title">RULES</h1>
          <h4 className="rules--sub-title">OBJECTIVE</h4>
          <p className="rules--paragraph">
            The first player to connect 4 of the same colored discs in a row (either vertically, horizontally or
            diagonally).
          </p>
          <h4 className="rules--sub-title">HOW TO PLAY</h4>
          <ol>
            <li>Red goes first in the first game.</li>
            <li>Players must alternate turns and only one disc can be dropped in each turn.</li>
            <li>The game ends when there is a 4-in-a-row or a stalemate.</li>
            <li>The starter of the previous game goes second on the next game.</li>
          </ol>
          <button id="close-btn" className="rules--btn" onClick={handleClick}>
            <i className="fa-solid fa-check"></i>
          </button>
        </div>
      )}
    </section>
  );
}
