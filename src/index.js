// import React, {useState} from "react";
// import * as ReactDOM from "react-dom";

import React from "./kreact/";
import ReactDOM, {useState} from "./kreact/react-dom";
import Component from "./kreact/Component";
import "./index.css";

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }
  // *
  static getDerivedStateFromProps(props, state) {
    // getDerivedStateFromProps 会在调用 render 方法之前调用，
    //并且在初始挂载及后续更新时都会被调用。
    //它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
    const {count} = state;
    console.log("getDerivedStateFromProps", count);
    return count < 3 ? null : {count: 0};
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
            //this.setState({count: count + 2});
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
