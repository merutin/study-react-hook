import React, { Component } from "react";
import "./App.css";

interface JankenProps {
  human?: number;
  computer?: number;
  judgment?: number;
}

interface JankenState {
  human?: number;
  computer?: number;
  judgment?: number;
}

class JankenGamePage extends Component<JankenProps, JankenState> {
  constructor(props: JankenProps) {
    super(props);
    this.state = { human: undefined, computer: undefined };
  }

  pon(human_hand: number) {
    const computer_hand = Math.floor(Math.random() * 3);
    this.setState({ human: human_hand, computer: computer_hand });
  }

  judge(): number | undefined {
    if (this.state.human === undefined || this.state.computer === undefined) {
      return undefined;
    } else {
      return (this.state.computer - this.state.human + 3) % 3;
    }
  }

  render() {
    return (
      <div>
        <h1>じゃんけん ポン！</h1>
        <JankenBox actionPon={(te: any) => this.pon(te)} />
        <ScoreBox
          human={this.state.human}
          computer={this.state.computer}
          judgment={this.judge()}
        />
      </div>
    );
  }
}

const JankenBox = (props: { actionPon: (arg0: number) => void }) => {
  return (
    <div>
      <button onClick={() => props.actionPon(0)}>グー</button>
      <button onClick={() => props.actionPon(1)}>チョキ</button>
      <button onClick={() => props.actionPon(2)}>パー</button>
    </div>
  );
};

const ScoreBox = (props: JankenProps) => {
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

function App() {
  return <JankenGamePage />;
}

export default App;
