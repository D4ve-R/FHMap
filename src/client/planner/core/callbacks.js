export class Callbacks {
  constructor() {
	this.callbacks = [];
  }

  add(func) {
	this.callbacks.push(func);
  }

  remove(func) {
	this.callbacks = this.callbacks.filter((f) => f !== func);
  }

  fire(...args) {
	this.callbacks.forEach((func) => func(...args));
  }
}
