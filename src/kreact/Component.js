export default function Component(props, context, updater) {
  this.props = props;
  this.updater = updater;
}

Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, "setState");
};

Component.prototype.isReactComponent = {};
