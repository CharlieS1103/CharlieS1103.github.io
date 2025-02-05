//@ts-check

class Question {
  constructor(label, type, options = []) {
    this.label = label;
    this.type = type;
    this.options = options;
  }
}

export default Question;