import {TEXT} from "./const";

// * vnode 、 vvnode代表虚拟dom对象
// * node dom节点

// container dom容器节点
function render(vnode, container) {
  // step 1: vnode -> node
  const node = createNode(vnode, container);

  // step2: container.appendChild(node);
  node && container.appendChild(node);
}

//vnode->node
function createNode(vnode, parentNode) {
  const {type, props} = vnode;

  let node = null;

  // todo 根据节点类型，生成dom节点
  if (type === TEXT) {
    // 文本节点
    node = document.createTextNode("");
  } else if (typeof type === "string") {
    // 原生标签节点
    node = document.createElement(type);
  } else if (typeof type === "function") {
    // 区分一下类组件与函数组件
    node = type.prototype.isReactComponent
      ? updateClassComponent(vnode, parentNode)
      : updateFunctionComponent(vnode, parentNode);
  } else if (type === undefined) {
    // node = document.createDocumentFragment();
  }
  // * 这里的if是判断是否是Fragment组件
  if (type === undefined) {
    // fragment
    reconcileChildren(parentNode, props.children);
  } else {
    // 遍历children
    reconcileChildren(node, props.children);

    // 更新属性
    updateNode(node, props);
  }
  return node;
}

// nextVal 数据类型 object
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .filter(k => k !== "children")
    .forEach(k => {
      node[k] = nextVal[k];
    });
}

// 类组件
// 类组件先实例化，再执行render
function updateClassComponent(vnode, parentNode) {
  const {type, props} = vnode;
  const instance = new type(props);
  const vvnode = instance.render();
  const node = createNode(vvnode, parentNode);
  return node;
}

// 函数组件处理
// 函数组件就是执行函数
function updateFunctionComponent(vnode, parentNode) {
  const {type, props} = vnode;
  const vvnode = type(props); //执行函数，得到子节点
  const node = createNode(vvnode, parentNode);
  return node;
}

function reconcileChildren(node, children) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    //child 是vnode，vnode->dom节点，插入到父dom节点中就可以了
    render(child, node);
  }
}

export default {render};
