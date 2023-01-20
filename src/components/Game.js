import React, { useState } from "react";
import { nanoid } from "nanoid";
import Logo from "./Logo";
import Timer from "./Timer";

export default function Game(props) {
  const [currentPlayer, setCurrentPlayer] = React.useState("player-1");
  const [firstPlayer, setFirstPlayer] = React.useState("player-1");
  const [modal, setModal] = React.useState({
    display: false,
    name: "",
    restarted: false,
  });
  const [winner, setWinner] = React.useState({
    completed: false,
    player: "",
  });
  const [change, setChange] = React.useState(false);
  const [playersPoints, setPlayersPoints] = React.useState({
    player1: 0,
    player2: 0,
  });
  const [hover, setHover] = useState(false);

  /**makes empty board 7x6 */
  const initialBoard = () => {
    const discsArray = [];
    let index = 0;

    while (discsArray.length < 7) {
      discsArray.push({
        id: nanoid(),
        discs: [
          {
            discTaken: false,
            takenBy: "",
            discNumber: index++,
            justClicked: false,
          },
          {
            discTaken: false,
            takenBy: "",
            discNumber: index++,
            justClicked: false,
          },
          {
            discTaken: false,
            takenBy: "",
            discNumber: index++,
            justClicked: false,
          },
          {
            discTaken: false,
            takenBy: "",
            discNumber: index++,
            justClicked: false,
          },
          {
            discTaken: false,
            takenBy: "",
            discNumber: index++,
            justClicked: false,
          },
          {
            discTaken: false,
            takenBy: "",
            discNumber: index++,
            justClicked: false,
          },
        ],
        disabled: false,
      });
    }

    return discsArray;
  };

  const [discBoard, setDiscBoard] = React.useState(initialBoard());

  /**click handler for Game.js */
  function handleClick(e) {
    // play again button - sets up new empty board, resets "winner" state, changes current player accordingly, changes state of "change" to enable CPU
    if (e === "play-again-btn") {
      setDiscBoard(initialBoard());
      setWinner({
        completed: false,
        player: "",
      });
      setCurrentPlayer(firstPlayer);
      setChange((prevChange) => !prevChange);
    }

    // sets display when menu or restart button is clicked
    else if (e === "menu-btn" || e === "restart-btn") {
      setModal((prevModal) => {
        return {
          ...prevModal,
          display: true,
          name: e === "menu-btn" ? "menu" : "restart",
        };
      });
    }

    // resets display when decline button or modal is clicked
    else if (e === "modal" || e === "decline-btn") {
      setModal({
        display: false,
        name: "",
        restarted: false,
      });
    }

    // if clicked button was "menu" and is confirmed - changes display to menu
    else if (e === "confirm-btn" && modal.name === "menu") {
      props.setDisplay({
        menu: true,
        game: false,
        gameType: "",
      });
    }

    // if clicked button was "restart" and is confirmed - resets the game
    else if (e === "confirm-btn" && modal.name === "restart") {
      setDiscBoard(initialBoard());
      setWinner({
        completed: false,
        player: "",
      });
      setCurrentPlayer("player-1");
      setFirstPlayer("player-1");
      setModal({
        display: false,
        name: "",
        restarted: true,
      });
      setPlayersPoints({
        player1: 0,
        player2: 0,
      });
    }

    // changes state of disc board when disc is clicked, changes current player and enables CPU move
    else if (e.discs) {
      setDiscBoard((prevDiscBoard) => {
        return prevDiscBoard.map((prevColumn) => {
          if (prevColumn.id === e.id) {
            const takenIndex = prevColumn.discs.findIndex((disc) => {
              if (disc.discTaken) {
                return disc;
              }
            });

            let discTakenAmount = 0;
            prevColumn.discs.forEach((disc) => {
              if (!disc.discTaken) {
                discTakenAmount++;
              }
            });

            return {
              ...prevColumn,
              discs: prevColumn.discs.map((eachDisc, index) => {
                if (takenIndex === -1) {
                  if (index === prevColumn.discs.length - 1) {
                    return {
                      ...eachDisc,
                      discTaken: true,
                      takenBy: currentPlayer,
                      justClicked: true,
                    };
                  } else {
                    return {
                      ...eachDisc,
                      justClicked: false,
                    };
                  }
                } else if (index === takenIndex - 1) {
                  return {
                    ...eachDisc,
                    discTaken: true,
                    takenBy: currentPlayer,
                    justClicked: true,
                  };
                } else {
                  return {
                    ...eachDisc,
                    justClicked: false,
                  };
                }
              }),
              disabled: discTakenAmount === 1 ? true : false,
            };
          } else {
            return {
              ...prevColumn,
              discs: prevColumn.discs.map((eachDisc) => {
                return {
                  ...eachDisc,
                  justClicked: false,
                };
              }),
            };
          }
        });
      });

      setCurrentPlayer((prevPlayer) => {
        return prevPlayer === "player-1" ? "player-2" : "player-1";
      });

      setChange((prevChange) => !prevChange);
    }
  }

  /**CPU move function */
  function cpu(discArrays) {
    const discElement = document.querySelector(".section-game--game");
    let loopIndex = false;
    let takeDisc;
    const initialArray = [];

    // array for "first move counter" option
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < discArrays[i].length; j++) {
        if (discArrays[i][j].player === 1) {
          initialArray.push(discArrays[i][j].player);
        }
      }
    }

    for (let i = 0; i < discArrays.length; i++) {
      const everyDiscArray = [];
      discArrays[i].forEach((element) => everyDiscArray.push(element.player));
      const winCheckCPU = /(0222)|(2022)|(2202)|(2220)/g.test(everyDiscArray.join(""));

      // CPU vertical win condition
      if (i < 7 && winCheckCPU && everyDiscArray.join("").includes("0222")) {
        takeDisc = discArrays[i][everyDiscArray.indexOf(2) - 1].discNumber;
        loopIndex = true;
        break;
      }

      // CPU horizontal win condition
      else if (i >= 7 && i < 13 && winCheckCPU) {
        if (
          everyDiscArray.join("").includes("0222") &&
          (i === 12 || discArrays[i + 1][everyDiscArray.join("").indexOf("0222")].player !== 0)
        ) {
          takeDisc = discArrays[i][everyDiscArray.join("").indexOf("0222")].discNumber;
          loopIndex = true;
        } else if (
          everyDiscArray.join("").includes("2022") &&
          (i === 12 || discArrays[i + 1][everyDiscArray.join("").indexOf("2022") + 1].player !== 0)
        ) {
          takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2022") + 1].discNumber;
          loopIndex = true;
        } else if (
          everyDiscArray.join("").includes("2202") &&
          (i === 12 || discArrays[i + 1][everyDiscArray.join("").indexOf("2202") + 2].player !== 0)
        ) {
          takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2202") + 2].discNumber;
          loopIndex = true;
        } else if (
          everyDiscArray.join("").includes("2220") &&
          (i === 12 || discArrays[i + 1][everyDiscArray.join("").indexOf("2220") + 3].player !== 0)
        ) {
          takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2220") + 3].discNumber;
          loopIndex = true;
        }

        if (loopIndex) {
          break;
        }
      }

      // CPU diagonal win condition
      if (i >= 13 && i < 25 && winCheckCPU) {
        if (everyDiscArray.join("").includes("2220")) {
          if (
            discArrays[i].length === 4 &&
            (i === 23 || i === 24 || discArrays[i + 2][discArrays[i + 2].length - 1].player !== 0)
          ) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2220") + 3].discNumber;
            loopIndex = true;
          } else if (discArrays[i].length === 5) {
            if (
              (i !== 21 &&
                i !== 22 &&
                discArrays[i + 2][discArrays[i + 2].length - 2 + everyDiscArray.join("").indexOf("2220")].player !==
                  0) ||
              ((i === 21 || i === 22) &&
                discArrays[i + 2][discArrays[i + 2].length - 1].player !== 0 &&
                everyDiscArray.join("").indexOf("2220") === 0) ||
              ((i === 21 || i === 22) && everyDiscArray.join("").indexOf("2220") === 1)
            ) {
              takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2220") + 3].discNumber;
              loopIndex = true;
            }
          } else if (discArrays[i].length === 6) {
            if (
              (everyDiscArray.join("").indexOf("2220") !== 2 &&
                discArrays[i + 2][discArrays[i + 2].length - 2 + everyDiscArray.join("").indexOf("2220")].player !==
                  0) ||
              everyDiscArray.join("").indexOf("2220") === 2
            ) {
              takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2220") + 3].discNumber;
              loopIndex = true;
            }
          }

          if (loopIndex) {
            break;
          }
        }

        if (everyDiscArray.join("").includes("2202")) {
          if (i >= 13 && i < 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("2202") + 3].player !== 0) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2202") + 2].discNumber;
            loopIndex = true;
          } else if (i >= 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("2202") + 2].player !== 0) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2202") + 2].discNumber;
            loopIndex = true;
          }

          if (loopIndex) {
            break;
          }
        }

        if (everyDiscArray.join("").includes("2022")) {
          if (i >= 13 && i < 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("2022") + 2].player !== 0) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2022") + 1].discNumber;
            loopIndex = true;
          } else if (i >= 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("2022") + 1].player !== 0) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("2022") + 1].discNumber;
            loopIndex = true;
          }

          if (loopIndex) {
            break;
          }
        }

        if (everyDiscArray.join("").includes("0222")) {
          if (i >= 13 && i < 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("0222") + 1].player !== 0) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("0222")].discNumber;
            loopIndex = true;
          } else if (i >= 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("0222")].player !== 0) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("0222")].discNumber;
            loopIndex = true;
          }

          if (loopIndex) {
            break;
          }
        }
      }

      // Player 1 first move - counter
      if (i < 7 && initialArray.length < 2 && everyDiscArray.includes(1) && firstPlayer === "player-1") {
        if (i >= 0 && i < 6) {
          takeDisc = discArrays[i + 1][0].discNumber;
        } else {
          takeDisc = discArrays[i - 1][0].discNumber;
        }
        loopIndex = true;
        break;
      }
    }

    // Player 1 block or CPU building 4 streak
    if (!loopIndex) {
      for (let i = 0; i < discArrays.length; i++) {
        const everyDiscArray = [];
        discArrays[i].forEach((element) => everyDiscArray.push(element.player));
        const winCheckP1 = /(0111)|(1011)|(1101)|(1110)/g.test(everyDiscArray.join(""));

        // Player 1 vertical win - block condition
        if (i < 7 && winCheckP1 && everyDiscArray.join("").includes("0111")) {
          takeDisc = discArrays[i][everyDiscArray.indexOf(1) - 1].discNumber;
          loopIndex = true;
          break;
        }

        // Player 1 horizontal win - block condition
        else if (i >= 7 && i < 13 && winCheckP1) {
          if (
            everyDiscArray.join("").includes("0111") &&
            (i === 12 || discArrays[i + 1][everyDiscArray.join("").indexOf("0111")].player !== 0)
          ) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("0111")].discNumber;
            loopIndex = true;
          } else if (
            everyDiscArray.join("").includes("1011") &&
            (i === 12 || discArrays[i + 1][everyDiscArray.join("").indexOf("1011") + 1].player !== 0)
          ) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1011") + 1].discNumber;
            loopIndex = true;
          } else if (
            everyDiscArray.join("").includes("1101") &&
            (i === 12 || discArrays[i + 1][everyDiscArray.join("").indexOf("1101") + 2].player !== 0)
          ) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1101") + 2].discNumber;
            loopIndex = true;
          } else if (
            everyDiscArray.join("").includes("1110") &&
            (i === 12 || discArrays[i + 1][everyDiscArray.join("").indexOf("1110") + 3].player !== 0)
          ) {
            takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1110") + 3].discNumber;
            loopIndex = true;
          }

          if (loopIndex) {
            break;
          }
        }

        // Player 1 diagonal win - block condition
        if (i >= 13 && i < 25 && winCheckP1) {
          if (everyDiscArray.join("").includes("1110")) {
            if (
              discArrays[i].length === 4 &&
              (i === 23 || i === 24 || discArrays[i + 2][discArrays[i + 2].length - 1].player !== 0)
            ) {
              takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1110") + 3].discNumber;
              loopIndex = true;
            } else if (discArrays[i].length === 5) {
              if (
                (i !== 21 &&
                  i !== 22 &&
                  discArrays[i + 2][discArrays[i + 2].length - 2 + everyDiscArray.join("").indexOf("1110")].player !==
                    0) ||
                ((i === 21 || i === 22) &&
                  discArrays[i + 2][discArrays[i + 2].length - 1].player !== 0 &&
                  everyDiscArray.join("").indexOf("1110") === 0) ||
                ((i === 21 || i === 22) && everyDiscArray.join("").indexOf("1110") === 1)
              ) {
                takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1110") + 3].discNumber;
                loopIndex = true;
              }
            } else if (discArrays[i].length === 6) {
              if (
                (everyDiscArray.join("").indexOf("1110") !== 2 &&
                  discArrays[i + 2][discArrays[i + 2].length - 2 + everyDiscArray.join("").indexOf("1110")].player !==
                    0) ||
                everyDiscArray.join("").indexOf("1110") === 2
              ) {
                takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1110") + 3].discNumber;
                loopIndex = true;
              }
            }

            if (loopIndex) {
              break;
            }
          }

          if (everyDiscArray.join("").includes("1101")) {
            if (i >= 13 && i < 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("1101") + 3].player !== 0) {
              takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1101") + 2].discNumber;
              loopIndex = true;
            } else if (i >= 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("1101") + 2].player !== 0) {
              takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1101") + 2].discNumber;
              loopIndex = true;
            }

            if (loopIndex) {
              break;
            }
          }

          if (everyDiscArray.join("").includes("1011")) {
            if (i >= 13 && i < 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("1011") + 2].player !== 0) {
              takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1011") + 1].discNumber;
              loopIndex = true;
            } else if (i >= 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("1011") + 1].player !== 0) {
              takeDisc = discArrays[i][everyDiscArray.join("").indexOf("1011") + 1].discNumber;
              loopIndex = true;
            }

            if (loopIndex) {
              break;
            }
          }

          if (everyDiscArray.join("").includes("0111")) {
            if (i >= 13 && i < 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("0111") + 1].player !== 0) {
              takeDisc = discArrays[i][everyDiscArray.join("").indexOf("0111")].discNumber;
              loopIndex = true;
            } else if (i >= 19 && discArrays[i + 2][everyDiscArray.join("").indexOf("0111")].player !== 0) {
              takeDisc = discArrays[i][everyDiscArray.join("").indexOf("0111")].discNumber;
              loopIndex = true;
            }

            if (loopIndex) {
              break;
            }
          }
        }
      }
    }

    // if there is no win condition - sets up longest streak
    if (!loopIndex) {
      takeDisc = getLongestStreakArrayIndex(discArrays);
    }

    discElement.children[takeDisc].click();

    /**returns disc number to be clicked - to get longest streak */
    function getLongestStreakArrayIndex(allArrays) {
      let biggestIndex = 0;
      let biggestStreak = 0;
      const anyFreeIndexArray = [];
      const fourFreeIndexArray = [];
      let winnable1 = false;
      let winnable2 = false;
      let winnable3 = false;

      // columns streaks
      for (let i = 0; i < 7; i++) {
        let playerArray = [];
        for (let j = 0; j < allArrays[i].length; j++) {
          playerArray.push(allArrays[i][j].player);
        }

        if (playerArray.join("").includes("0022")) {
          biggestIndex = i;
          biggestStreak = 2;
          winnable1 = true;
        } else if (playerArray.join("").includes("0002") && biggestStreak < 2) {
          biggestIndex = i;
          biggestStreak = 1;
          winnable2 = true;
        } else if (playerArray.join("").includes("0000") && biggestStreak === 0) {
          fourFreeIndexArray.push(i);
          winnable3 = true;
        } else if (playerArray.join("").includes("0")) {
          anyFreeIndexArray.push(i);
        }
      }

      if (!winnable1 && !winnable2 && !winnable3) {
        biggestIndex = anyFreeIndexArray[Math.floor(Math.random() * anyFreeIndexArray.length)];
      } else if (!winnable1 && !winnable2 && winnable3) {
        biggestIndex = fourFreeIndexArray[Math.floor(Math.random() * fourFreeIndexArray.length)];
      }

      return discArrays[biggestIndex][0].discNumber;
    }
  }

  // everytime state changes of "change", creates new updated matrix, checks for winners and fires up CPU function if game is against CPU
  React.useEffect(() => {
    // creates empty matrix 6x7
    const matrix = Array(6)
      .fill()
      .map(() => Array(7).fill());

    // populates matrix with discs from disc board
    discBoard.map((column, columnIndex) => {
      column.discs.map((disc, discIndex) => {
        let playerNumber = 0;
        if (disc.takenBy === "player-1") {
          playerNumber = 1;
        } else if (disc.takenBy === "player-2") {
          playerNumber = 2;
        }

        matrix[discIndex][columnIndex] = {
          player: playerNumber,
          discNumber: disc.discNumber,
        };
      });
    });

    // array containing arrays with vertical, horizontal and diagonal options of the matrix
    const discArrays = [];

    for (let i = 0; i <= matrix.length; i++) {
      const verticalArray = [];
      for (let j = 0; j < matrix.length; j++) {
        verticalArray.push(matrix[j][i]);
      }
      discArrays.push(verticalArray);
    }

    for (let i = 0; i < matrix.length; i++) {
      const horizontalArray = [];
      for (let j = 0; j <= matrix.length; j++) {
        horizontalArray.push(matrix[i][j]);
      }
      discArrays.push(horizontalArray);
    }

    for (let i = 3; i < matrix.length; i++) {
      const diagonalArray = [];
      let tempIndex = i;
      for (let j = matrix.length; j >= 0; j--) {
        if (tempIndex >= 0) {
          diagonalArray.push(matrix[tempIndex][j]);
          tempIndex--;
        } else {
          break;
        }
      }
      discArrays.push(diagonalArray.reverse());

      const diagonalArray2 = [];
      tempIndex = i;
      for (let j = 0; j <= matrix.length; j++) {
        if (tempIndex >= 0) {
          diagonalArray2.push(matrix[tempIndex][j]);
          tempIndex--;
        } else {
          break;
        }
      }

      discArrays.push(diagonalArray2.reverse());
    }

    for (let i = 0; i < 4; i++) {
      const diagonalArray = [];
      let tempIndex = i;
      for (let j = 0; j <= matrix.length; j++) {
        if (tempIndex < matrix.length) {
          diagonalArray.push(matrix[tempIndex][j]);
          tempIndex++;
        } else {
          break;
        }
      }
      discArrays.push(diagonalArray);

      const diagonalArray2 = [];
      tempIndex = i;
      for (let j = matrix.length; j >= 0; j--) {
        if (tempIndex < matrix.length) {
          diagonalArray2.push(matrix[tempIndex][j]);
          tempIndex++;
        } else {
          break;
        }
      }

      discArrays.push(diagonalArray2);
    }

    let gameCompleted = false;
    let stalemate = true;

    // checks "discArrays" for a winner or a stalemate
    discArrays.forEach((discArray) => {
      const playerArray = [];
      discArray.forEach((content) => playerArray.push(content.player));

      const player1win = /(1111)/g.test(playerArray.join(""));
      const player2win = /(2222)/g.test(playerArray.join(""));
      const stalemateCheck = /(0000)|(0111)|(1011)|(1101)|(1110)|(0222)|(2022)|(2202)|(2220)/g.test(
        playerArray.join("")
      );

      // if there is a winner - sets state of "winner" accordingly and changes state of "firstPlayer". If there isn't a stalemate - changes boolean to false
      if (player1win || player2win) {
        gameCompleted = true;
        setWinner({
          completed: true,
          player: currentPlayer === "player-1" ? "player-2" : "player-1",
        });
        setFirstPlayer((prevFirstPlayer) => {
          return prevFirstPlayer === "player-1" ? "player-2" : "player-1";
        });
      } else if (stalemateCheck) {
        stalemate = false;
      }
    });

    // if game is against CPU fires up CPU function. If there is stalemate - changes state of "winner" and state of "firstPlayer"
    if (props.gameType === "pvc" && !gameCompleted && currentPlayer === "player-2" && !stalemate) {
      cpu(discArrays);
    } else if (stalemate) {
      setWinner({
        completed: true,
        player: "stalemate",
      });
      setFirstPlayer((prevFirstPlayer) => {
        return prevFirstPlayer === "player-1" ? "player-2" : "player-1";
      });
    }
  }, [change]);

  // everytime state of "winner" changes - sets up "playerPoints" accordingly
  React.useEffect(() => {
    if (winner.completed) {
      setPlayersPoints((prevPlayersPoints) => {
        if (winner.player === "player-1") {
          return {
            ...prevPlayersPoints,
            player1: prevPlayersPoints.player1 + 1,
          };
        } else if (winner.player === "player-2") {
          return {
            ...prevPlayersPoints,
            player2: prevPlayersPoints.player2 + 1,
          };
        } else {
          return prevPlayersPoints;
        }
      });
    }
  }, [winner]);

  /**handles mouse over disc event to mark where new disc will be dropped */
  function handleOnMouseEnter(column) {
    setHover(true);
    const discElement = document.querySelector(".section-game--game");
    let hoveredDisc;

    // finds first not taken disc from column, counting from bottom
    for (let i = column.length - 1; i >= 0; i--) {
      if (column[i].takenBy === "") {
        hoveredDisc = column[i].discNumber;
        break;
      }
    }

    // gives appriopriate style to location of disc to be dropped
    hoveredDisc &&
      hover &&
      (discElement.children[hoveredDisc].style.backgroundColor = `${
        currentPlayer === "player-1" ? "#FFB3C3" : "#FFE9B5"
      }`);
  }

  /** resets hover state, removes "clicked" class and rerenders game */
  function handleOnMouseLeave() {
    setHover(false);

    setDiscBoard((prevDiscBoard) => {
      return prevDiscBoard.map((prevColumn) => {
        return {
          ...prevColumn,
          discs: prevColumn.discs.map((eachDisc) => {
            return {
              ...eachDisc,
              justClicked: false,
            };
          }),
        };
      });
    });
  }

  // creates buttons for every disc on disc board
  const discs = discBoard.map((column) => {
    return column.discs.map((disc) => {
      /**gives appropriate name of owner to classname of disc */
      function setDiscOwner() {
        if (disc.discTaken && disc.takenBy === "player-1") {
          return " p-1-disc";
        } else if (disc.discTaken && disc.takenBy === "player-2") {
          return " p-2-disc";
        } else {
          return "";
        }
      }

      return (
        <button
          key={nanoid()}
          className={`game--btn${setDiscOwner()}${disc.justClicked ? " clicked" : ""}`}
          onClick={() => handleClick(column)}
          disabled={column.disabled || winner.completed ? true : false}
          onMouseEnter={() => handleOnMouseEnter(column.discs)}
          onMouseLeave={handleOnMouseLeave}
        ></button>
      );
    });
  });

  /**return text for completed game container accordingly */
  function getPlayer2Name() {
    if (winner.player === "stalemate") {
      return;
    } else {
      return props.gameType === "pvp" ? "PLAYER 2" : "CPU";
    }
  }

  return (
    <section className="section-game">
      <header className="section-game--header">
        <button id="menu-btn" className="option-btn" onClick={(e) => handleClick(e.target.id)}>
          MENU
        </button>
        <Logo />
        <button id="restart-btn" className="option-btn" onClick={(e) => handleClick(e.target.id)}>
          RESTART
        </button>
      </header>

      <div className="section-game--scores">
        <div className="player-info-container">
          <div className="icon-container p-1">
            <i className="fa-regular fa-face-smile player-icon p-1-icon"></i>
          </div>
          <h3 className="player-info--name">PLAYER 1</h3>
          <h1 className="player-info--score">{playersPoints.player1}</h1>
        </div>
        <div className="player-info-container">
          <div className="icon-container p-2">
            {props.gameType === "pvp" ? (
              <i className="fa-regular fa-face-smile player-icon p-2-icon"></i>
            ) : (
              <i className="fa-regular fa-face-meh-blank player-icon p-2-icon"></i>
            )}
          </div>
          <h3 className="player-info--name">{props.gameType === "pvp" ? "PLAYER 2" : "CPU"}</h3>
          <h1 className="player-info--score">{playersPoints.player2}</h1>
        </div>
      </div>

      <div className="section-game--game">{discs}</div>

      {!winner.completed ? (
        <div className={`section-game--timer-container${currentPlayer === "player-1" ? " p-1" : " p-2"}`}>
          <h3 className="timer--player-name">{currentPlayer === "player-1" ? "PLAYER 1" : getPlayer2Name()}'S TURN</h3>
          <h1 className="timer--time">
            <Timer
              currentPlayer={currentPlayer}
              setCurrentPlayer={setCurrentPlayer}
              modal={modal}
              setModal={setModal}
              setChange={setChange}
            />
            s
          </h1>
        </div>
      ) : (
        <div className="section-game--winner">
          <h4>{winner.player === "player-1" ? "PLAYER 1" : getPlayer2Name()}</h4>
          <h1>{winner.player === "stalemate" ? "STALEMATE" : "WINS"}</h1>
          <button id="play-again-btn" className="option-btn" onClick={(e) => handleClick(e.target.id)}>
            PLAY AGAIN
          </button>
        </div>
      )}

      {modal.display && (
        <div className="modal" onClick={(e) => handleClick(e.target.className)}>
          <div className="modal--content">
            <h3>Are you sure you want to {modal.name === "menu" ? "return to Menu?" : "restart the game?"} </h3>
            <div className="confirmation-buttons">
              <button id="confirm-btn" className="option-btn" onClick={(e) => handleClick(e.target.id)}>
                YES
              </button>
              <button id="decline-btn" className="option-btn" onClick={(e) => handleClick(e.target.id)}>
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
