import React from "react";
import Menu from "./components/Menu";
import Game from "./components/Game";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const [display, setDisplay] = React.useState({
    menu: true,
    game: false,
    gameType: "",
  });

  return (
    <ErrorBoundary>
      <>
        {display.menu && <Menu setDisplay={setDisplay} />}
        {display.game && <Game gameType={display.gameType} setDisplay={setDisplay} />}
      </>
    </ErrorBoundary>
  );
}
