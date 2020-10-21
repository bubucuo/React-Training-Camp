// import * as React from "react";
// import * as ReactDOM from "react-dom";

import React from "./kreact/";
import ReactDOM from "./kreact/react-dom";
// import Component from "./kreact/Component";

import "./index.css";

const jsx = (
  <div className="border">
    <h1>慢 慢 慢</h1>
    <p>开课吧</p>
    <a href="https://www.kaikeba.com/">开课吧</a>
  </div>
);

// 经过babel-loader编译，jsx就是React.createElement(...)函数执行
ReactDOM.render(jsx, document.getElementById("root"));
console.log("version-sy-log", React.version); //sy-log
