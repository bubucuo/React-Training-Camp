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

// *
// fiber 结构
// type 类型
// props 属性
// child 第一个子节点 fiber
// sibling 下一个兄弟节点 fiber
// return 父节点 fiber
// stateNode 原生标签的dom节点
// *

// wipRoot 正在工作的fiber的跟节点
let wipRoot = null;
function render(vnode, container) {
  wipRoot = {
    type: "div",
    props: {
      children: {...vnode}
    },
    stateNode: container
  };
  nextUnitOfWork = wipRoot;
}

function isStringOrNumber(sth) {
  return typeof sth === "string" || typeof sth === "number";
}

// 给原生标签 创建dom节点
function createNode(workInProgress) {
  const {type, props} = workInProgress;
  let node = document.createElement(type);
  updateNode(node, props);

  return node;
}

// 更新真实dom节点属性，className、id、href
// 源码中需要处理的就复杂了，比如style、合成事件
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    // .filter(k => k !== "children")
    .forEach(k => {
      if (k === "children") {
        if (isStringOrNumber(nextVal[k])) {
          node.textContent = nextVal[k] + "";
        }
      } else {
        node[k] = nextVal[k];
      }
    });
}

// 原生标签节点，div、a
function updateHostComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    // 创建dom节点
    workInProgress.stateNode = createNode(workInProgress);
  }

  // 协调子节点
  reconcileChildren(workInProgress, workInProgress.props.children);
  console.log("workInProgress", workInProgress); //sy-log
}

// 函数组件
// 拿到子节点，然后协调
function updateFunctionComponent(workInProgress) {
  const {type, props} = workInProgress;
  const child = type(props);

  reconcileChildren(workInProgress, child);
}

function updateClassComponent(workInProgress) {
  const {type, props} = workInProgress;
  const instance = new type(props);
  const child = instance.render();
  reconcileChildren(workInProgress, child);
}

function updateFragmentComponent(workInProgress) {
  reconcileChildren(workInProgress, workInProgress.props.children);
}

// 协调子节点
function reconcileChildren(workInProgress, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = Array.isArray(children) ? children : [children];

  // 记录上一个fiber节点（就是哥哥或者姐姐）
  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];

    let newFiber = {
      type: child.type,
      props: {...child.props},
      child: null,
      sibling: null,
      return: workInProgress,
      stateNode: null
    };

    if (i === 0) {
      // newFiber 是workInProgress第一个子fiber
      workInProgress.child = newFiber;
    } else {
      // sibling是下一个兄弟节点
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}

// 下一个要渲染更新的任务 fiber
let nextUnitOfWork = null;
// work in progress

function performUnitOfWork(workInProgress) {
  //step1:  渲染更新fiber
  // todo

  const {type} = workInProgress;
  if (typeof type === "string") {
    // 原生标签节点
    updateHostComponent(workInProgress);
  } else if (typeof type === "function") {
    type.prototype.isReactComponent
      ? updateClassComponent(workInProgress)
      : updateFunctionComponent(workInProgress);
  } else {
    updateFragmentComponent(workInProgress);
  }

  // step2: 并且返回下一个(王朝的故事)
  // 有长子
  if (workInProgress.child) {
    return workInProgress.child;
  }
  let nextFiber = workInProgress;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    // 渲染更新fiber，并且返回下一个
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // commit
  if (!nextUnitOfWork && wipRoot) {
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
  // step1  渲染更新自己
  // todo
  // vode->node, node更新到container
  //怎么拿到 parentNode

  let parentNodeFiber = workInProgress.return;
  // fiber节点不一定有dom节点，比如fragment、Consumer
  while (!parentNodeFiber.stateNode) {
    parentNodeFiber = parentNodeFiber.return;
  }
  let parentNode = parentNodeFiber.stateNode;

  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  }

  // step2 渲染更新子节点
  commitWorker(workInProgress.child);
  // step3 渲染更新sibling
  commitWorker(workInProgress.sibling);
}

export default {render};
