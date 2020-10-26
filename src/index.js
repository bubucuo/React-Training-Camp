// import React, {Component} from "react";
// import * as ReactDOM from "react-dom";

import React from "./kreact/";
import ReactDOM from "./kreact/react-dom";
import Component from "./kreact/Component";

import "./index.css";

// 类组件
class ClassComponent extends Component {
  static defaultProps = {
    color: "pink"
  };
  render() {
    return (
      <div className="border">
        ClassComponent - {this.props.name}
        <p className={this.props.color}>color</p>
      </div>
    );
  }
}

// 函数组件
function FunctionComponent(props) {
  return <div className="border">FunctionComponent-{props.name}</div>;
}

const jsx = (
  <div className="border">
    <h1>慢 慢 慢</h1>
    <p>开课吧</p>
    <a href="https://www.kaikeba.com/">开课吧</a>
    {/* <FunctionComponent name="函数组件" /> */}
    {/* <ClassComponent name="类组件" color="red" /> */}
    {/* <ul>
      <Node />
    </ul> */}
  </div>
);

// key 标识了当前层级下节点的唯一性
// 判断节点能不能复用的前提同一层级下的节点的key和type都相等
// 区分<React.Fragment></React.Fragment>和<></>
function Node(props) {
  // return [1, 2, 3].map(item => (
  //   <React.Fragment key={item}>
  //     <li key={item}>{item}</li>
  //     <li key={item}>{item}</li>
  //   </React.Fragment>
  // ));
  return (
    <>
      <li>东方不败</li>
      <li>跑路的令狐冲</li>
      <li>张无忌</li>
    </>
  );
}

// 经过babel-loader编译，jsx就是React.createElement(...)函数执行
ReactDOM.render(jsx, document.getElementById("root"));
console.log("version-sy-log", React.version); //sy-log

// 原生标签节点
// 文本节点
// 函数组件节点

// *
// !
// ?
// todo 这里不是要做的事情 只是大家对黄色敏感而已
// todo React.createElement什么时候调用了？
// * 因为react里我写的jsx， jsx经过babel-loader编译，会变成React.createElement(...)函数的执行

// todo 函数组件和类组件区别?
//
