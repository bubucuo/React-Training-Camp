import {TEXT} from "./const";

// type 标记了不同节点的类型，比如原生标签是字符串，文本的就没有type，函数组件就是函数，类组件就是类
function createElement(type, config, ...children) {
  if (config) {
    delete config.__source;
    delete config.__self;
  }
  // ! 今天不考虑key和ref
  const props = {
    ...((type && type.defaultProps) || {}),
    ...config,
    // * 源码中会区分props.children的类型，如数组、单个对象，
    // * kreact只考虑children数组的情况
    children: children.map(child =>
      typeof child === "object" ? child : createTextNode(child)
    )
  };
  return {
    type,
    props
  };
}

// dom.
// ! 源码中没有这个处理
function createTextNode(text) {
  return {
    type: TEXT,
    props: {
      children: [],
      nodeValue: text
    }
  };
}

export default {
  createElement
};
