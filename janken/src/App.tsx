import React from "react";
import "./App.css";

interface JankenProps {
  human?: number;
  computer?: number;
  judgment?: number;
}

const JankenBox: React.FC<{ actionPon: (te: number) => void }> = (props) => {
  return (
    <div>
      <button onClick={() => props.actionPon(0)}>グー</button>
      <button onClick={() => props.actionPon(1)}>チョキ</button>
      <button onClick={() => props.actionPon(2)}>パー</button>
    </div>
  );
};

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
  const [te, setTe] = React.useState<JankenProps>();

  const pon = (human_hand: number) => {
    const computer_hand = Math.floor(Math.random() * 3);
    setTe({ human: human_hand, computer: computer_hand });
  };

  const judge = (): number | undefined => {
    if (
      te === undefined ||
      te.human === undefined ||
      te.computer === undefined
    ) {
      return undefined;
    } else {
      return (te.computer - te.human + 3) % 3;
    }
  };

  return (
    <div>
      <h1>じゃんけん ポン！</h1>
      <JankenBox actionPon={(te: any) => pon(te)} />
      <ScoreBox
        human={te !== undefined ? te.human : undefined}
        computer={te !== undefined ? te.computer : undefined}
        judgment={judge()}
      />
    </div>
  );
};

export default App;
