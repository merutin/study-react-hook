import React from "react";
import "./App.css";

interface JankenProps {
  human?: number;
  computer?: number;
  judgment?: number;
}

const ScoreBox: React.FC<JankenProps> = (props) => {
  const teString = ["グー", "チョキ", "パー"];
  const judgmentString = ["引き分け", "勝ち", "負け"];

  return (
    <table>
      <tbody>
        <tr>
          <th>あなた</th>
          <td>{props.human !== undefined ? teString[props.human] : ""}</td>
        </tr>
        <tr>
          <th>Computer</th>
          <td>
            {props.computer !== undefined ? teString[props.computer] : ""}
          </td>
        </tr>
        <tr>
          <th>勝敗</th>
          <td>
            {props.judgment !== undefined ? judgmentString[props.judgment] : ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const App: React.FC = () => {
  const [mySelect, setMySelect] = React.useState<number>();
  const [computer, setComputer] = React.useState<number>();

  React.useEffect(() => {
    if (mySelect === undefined) {
      return;
    }
    const computer_hand = Math.floor(Math.random() * 3);
    setComputer(computer_hand);

    return () => {
      setComputer(undefined);
    };
  }, [mySelect]);

  const judge = React.useMemo<number | undefined>(() => {
    if (mySelect === undefined || computer === undefined) {
      return undefined;
    } else {
      return (computer - mySelect + 3) % 3;
    }
  }, [mySelect, computer]);

  return (
    <div>
      <h1>じゃんけん ポン！</h1>
      <div>
        <button onClick={() => setMySelect(0)}>グー</button>
        <button onClick={() => setMySelect(1)}>チョキ</button>
        <button onClick={() => setMySelect(2)}>パー</button>
      </div>
      <ScoreBox human={mySelect} computer={computer} judgment={judge} />
    </div>
  );
};

export default App;
