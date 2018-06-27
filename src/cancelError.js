class CancelError {
  constructor({ message, cancelType, isCancelledByType }) {
    this.cancelType = cancelType;
    this.isCancelledByType = isCancelledByType;
  }

  toString() {
    return this.message;
  }
}

export default CancelError;
