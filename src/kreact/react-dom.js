// * vnode 、 vvnode代表虚拟dom对象
// * node dom节点

// container dom容器节点
function render(vnode, container) {
  console.log("vndoe", vnode); //sy-log
  // step 1: vnode -> node
  const node = createNode(vnode);

  // step2: container.appendChild(node);
  container.appendChild(node);
}

//vnode->node
function createNode(vnode) {
  const {type, props} = vnode;

  let node;

  // todo 根据节点类型，生成dom节点
  if (type === "TEXT") {
    // 文本节点
    node = document.createTextNode("");
  } else if (typeof type === "string") {
    // 原生标签节点
    node = document.createElement(type);
  } else if (typeof type === "function") {
    node = updateFunctionComponent(vnode);
  }

  // 遍历children
  reconcileChildren(node, props.children);

  // 更新属性
  updateNode(node, props);
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

// 函数组件处理
function updateFunctionComponent(vnode) {
  const {type, props} = vnode;
  const vvnode = type(props); //执行函数，得到子节点
  const node = createNode(vvnode);
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
