import {scheduleUpdateOnFiber} from "./react-dom";

export function constructClassInstance(fiber) {
  const {type, props} = fiber;
  let instance = new type(props);
  adoptClassInstance(fiber, instance);
  return instance;
}

function adoptClassInstance(fiber, instance) {
  instance.updater = classComponentUpdater;
  fiber.stateNode = instance;
  fiber.memoizedState = instance.state;
  instance._reactInternals = fiber;
}

export function mountClassInstance(workInProgress) {
  const ctor = workInProgress.type;
  const instance = workInProgress.stateNode;
  //  instance.state = workInProgress.memoizedState;

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      workInProgress.props
    );
    instance.state = workInProgress.memoizedState;
  }
}

export function updateClassInstance(workInProgress) {
  const ctor = workInProgress.type;
  const instance = workInProgress.stateNode;
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  console.log("hahhah", workInProgress); //sy-log
  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      workInProgress.props
    );
    instance.state = workInProgress.memoizedState;
  }
}

function applyDerivedStateFromProps(
  workInProgress,
  ctor,
  getDerivedStateFromProps,
  newProps
) {
  const prevState = workInProgress.memoizedState;
  const partialState = getDerivedStateFromProps(newProps, prevState);
  console.log("prevState---", prevState, partialState); //sy-log
  if (partialState) {
    workInProgress.memoizedState = {
      ...prevState,
      ...partialState
    };
  }
}

const classComponentUpdater = {
  isMounted: false,
  enqueueSetState(inst, payload, callback) {
    const fiber = inst._reactInternals;
    Object.assign(fiber.memoizedState, payload);
    console.log("enqueueSetState", fiber); //sy-log
    scheduleUpdateOnFiber(fiber);
  }
};
