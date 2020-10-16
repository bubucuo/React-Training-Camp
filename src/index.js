// import * as React from "react";
// import * as ReactDOM from "react-dom";

import React from "./kreact/";
import ReactDOM, {useState} from "./kreact/react-dom";
// import Component from "./kreact/Component";
import "./index.css";

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }
  render() {
    const {count} = this.state;
    return (
      <div className="border">
        <h3>ClassComponent</h3>
        <p>{this.props.name}</p>
        <button
          onClick={() => {
            this.setState({count: count + 1});
          }}>
          add count: {count}
        </button>
      </div>
    );
  }
}

function FunctionComponent(props) {
  const [count, setCount] = useState(0);
  return (
    <div className="border">
      <h3>FunctionComponent</h3>
      <p>{props.name}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}>
        add count: {count}
      </button>
    </div>
  );
}

const jsx = (
  <div className="border">
    <p>开课吧</p>
    <a href="https://www.kaikeba.com/">开课吧</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
  </div>
);

ReactDOM.render(jsx, document.getElementById("root"));

console.log("version-sy-log", React.version); //sy-log
