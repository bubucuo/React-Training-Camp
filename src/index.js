import React, {Component} from "react";
import ReactDOM from "react-dom";
// import ReactDOM from "./kreact/react-dom";
// import Component from "./kreact/Component";
import "./index.css";

function Example() {
  // 声明一个新的叫做 “count” 的 state 变量
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <p>{this.props.name}</p>
      </div>
    );
  }
}

function FunctionComponent(props) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  );
}

function FragmentComponent(props) {
  return (
    <>
      <li>1</li>
      <li>2</li>
    </>
  );
}

const jsx = (
  <section className="border">
    <h1>慢慢慢</h1>
    <h1>全栈</h1>
    <a href="https://www.kaikeba.com/">kkb</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
    <Example />
    <>
      <h1>1</h1>
      <h2>2</h2>
    </>
    <ul>
      <FragmentComponent />
    </ul>
    {/* {[1, 2].map(item => (
      <React.Fragment key={Math.random()}>
        <h1>1-{item}</h1>
        <h2>2-{item}</h2>
      </React.Fragment>
    ))}*/}
  </section>
);

ReactDOM.render(jsx, document.getElementById("root"));

// ! ReactDOM.render与类组件中的render没有关系

// * 不同节点的渲染
// 原生标签节点，比如div、a等  document.createElement
// 文本节点    document.createTextNode或者node.textContext或者是node.nodeValue
// 函数组件     执行函数的结果
// 类组件      先实例化，再执行render函数
// Fragment   直接遍历子节点
