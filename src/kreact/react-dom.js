import {TEXT} from "./const";

// * vnode 、 vvnode代表虚拟dom对象
// * node dom节点

// container dom容器节点
function render(vnode, container) {
  // // step 1: vnode -> node
  // const node = createNode(vnode, container);

  // // step2: container.appendChild(node);
  // node && container.appendChild(node);

  wipRoot = {
    stateNode: container,
    props: {
      children: [vnode]
    }
  };

  nextUnitOfWork = wipRoot;
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

// function reconcileChildren(node, children) {
//   for (let i = 0; i < children.length; i++) {
//     const child = children[i];
//     //child 是vnode，vnode->dom节点，插入到父dom节点中就可以了
//     render(child, node);
//   }
// }

// 下一个要工作的fiber
let nextUnitOfWork = null;

// work in progress 正在工作中的
// 正在工作中的fiber root
let wipRoot = null;

// *fiber的属性

// *

function reconcileChildren(workInProgress, children) {
  let previousNewFiber = null;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // 这就是一个fiber node节点
    let newFiber = {
      type: child.type,
      key: child.key,
      props: child.props,
      stateNode: null, // 如果是原生标签节点，这个值存储dom节点
      child: null, //第一个子节点
      sibling: null, //下一个兄弟节点
      return: workInProgress // 父节点
    };

    if (i === 0) {
      // workInProgress的第一个子fiber
      workInProgress.child = newFiber;
    } else {
      // 构建sibling（下一个兄弟节点）
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}

function updateHostComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress);
  }

  // 协调子节点
  reconcileChildren(workInProgress, workInProgress.props.children);

  // console.log("wwwwww", workInProgress); //sy-log
}

function performUnitOfWork(workInProgress) {
  // * step 1: 处理当前fiber

  // 原生标签节点，如div、p、a等
  updateHostComponent(workInProgress);

  // * step2: 并且返回下一个要处理的fiber （参考王朝的故事）
  if (workInProgress.child) {
    return workInProgress.child;
  }

  let next = workInProgress;
  while (next) {
    if (next.sibling) {
      return next.sibling;
    }
    next = next.return;
  }
}

// 更新fiber
function workLoop(idleDeadline) {
  //timeRemaining()获取浏览器剩余空闲时间
  while (nextUnitOfWork && idleDeadline.timeRemaining() > 1) {
    // 处理当前fiber，并且返回下一个要处理的fiber
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // commitRoot
  if (!nextUnitOfWork && wipRoot) {
    // vnode_>node, 更新到container中
    commitRoot();
  }
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(wipRoot.child);
  wipRoot = null;
}

function commitWorker(workInProgress) {
  if (!workInProgress) {
    return;
  }

  // step1: 提交workInProgress
  // todo parentNode.appendChild(workInProgress.stateNode)

  let parentNodeFiber = workInProgress.return;

  // parentNode是父fiber
  let parentNode = parentNodeFiber.stateNode;

  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  }

  // step2: 提交workInProgress.child
  commitWorker(workInProgress.child);
  // step3: 提交workInProgress.sibling
  commitWorker(workInProgress.sibling);
}

export default {render};
