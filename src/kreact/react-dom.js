// vnode 虚拟dom节点
// node dom节点

// * vnode

// type 原生标签 string
//      文本节点 没有type
//      函数组件 函数
//      类组件   类
// props 属性 如className 、 href、 id、children等
//

// *

function render(vnode, container) {
  console.log("vnode", vnode); //sy-log

  //  step1 vnode->node
  const node = createNode(vnode);
  // step2
  container.appendChild(node);
}

function isStringOrNumber(sth) {
  return typeof sth === "string" || typeof sth === "number";
}

// 根据虚拟dom节点，生成真实dom节点
// 这里需要注意的就是节点类型，因为不同节点渲染方式不同
function createNode(vnode) {
  let node;

  const {type} = vnode;

  // todo 根据虚拟dom节点，生成真实dom节点
  if (typeof type === "string") {
    // 原生标签节点， div\a
    node = updateHostComponent(vnode);
  } else if (isStringOrNumber(vnode)) {
    // 文本标签节点
    node = updateTextComponent(vnode);
  } else if (typeof type === "function") {
    node = type.prototype.isReactComponent
      ? updateClassComponent(vnode)
      : updateFunctionComponent(vnode);
  } else {
    // 处理fragment
    node = updateFragmentComponent(vnode);
  }

  return node;
}

// 更新真实dom节点属性，className、id、href
// 源码中需要处理的就复杂了，比如style、合成事件
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .filter(k => k !== "children")
    .forEach(k => {
      node[k] = nextVal[k];
    });
}

// 原生标签节点，div、a
function updateHostComponent(vnode) {
  const {type, props} = vnode;
  const node = document.createElement(type); //真实dom节点
  updateNode(node, props);
  reconcileChildren(node, props.children);
  return node;
}

function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode);
  return node;
}

// 返回node
// 执行函数就行啦
function updateFunctionComponent(vnode) {
  const {type, props} = vnode;
  const child = type(props);
  // vnode -> node
  const node = createNode(child);
  return node;
}

// 返回node
// 先实例化
// 再执行render函数
function updateClassComponent(vnode) {
  const {type, props} = vnode;
  const instance = new type(props);
  const child = instance.render();
  // vnode -> node
  const node = createNode(child);
  return node;
}

// 返回node
function updateFragmentComponent(vnode) {
  // ! 源码当中并没有使用createDocumentFragment，而是直接处理子节点
  const node = document.createDocumentFragment();
  reconcileChildren(node, vnode.props.children);
  return node;
}

//遍历子节点，子节点是vnode，然后再vnode->node,再插入parentNode中
// 遍历执行render
function reconcileChildren(parentNode, children) {
  const newChildren = Array.isArray(children) ? children : [children];

  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    // vnode->node, 再把node插入到parentNode
    render(child, parentNode);
  }
}

export default {render};
