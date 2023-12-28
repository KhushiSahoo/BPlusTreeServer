export class Node {
    constructor(order) {
      this.order = order;
      this.keys = [];
      this.values = [];
      this.leaf = true;
    }
  
    add(key, value) {
      if (!this.keys.length) {
        this.keys.push(key);
        this.values.push([value]);
        return;
      }
  
      for (let i = 0; i < this.keys.length; i++) {
        if (key === this.keys[i]) {
          this.values[i].push(value);
          return;
        } else if (key < this.keys[i]) {
          this.keys.splice(i, 0, key);
          this.values.splice(i, 0, [value]);
          return;
        } else if (i + 1 === this.keys.length) {
          this.keys.push(key);
          this.values.push([value]);
          return;
        }
      }
    }
  
    split() {
      const left = new Node(this.order);
      const right = new Node(this.order);
      const mid = Math.floor(this.order / 2);
  
      left.keys = this.keys.slice(0, mid);
      left.values = this.values.slice(0, mid);
  
      right.keys = this.keys.slice(mid);
      right.values = this.values.slice(mid);
  
      this.keys = [right.keys[0]];
      this.values = [left, right];
      this.leaf = false;
    }
  
    isFull() {
      return this.keys.length === this.order;
    }
  
    show(counter = 0) {
      console.log(`${counter} ${this.keys}`);
  
      if (!this.leaf) {
        for (const item of this.values) {
          item.show(counter + 1);
        }
      }
    }
  }
  
  export class BPlusTree {
    constructor(order = 3) {
      this.root = new Node(order);
    }
  
    find(node, key) {
      for (let i = 0; i < node.keys.length; i++) {
        if (key < node.keys[i]) {
          return { child: node.values[i], index: i };
        }
      }
  
      return { child: node.values[node.values.length - 1], index: node.keys.length };
    }
  
    merge(parent, child, index) {
      parent.values.splice(index, 1);
      const pivot = child.keys[0];
  
      for (let i = 0; i < parent.keys.length; i++) {
        if (pivot < parent.keys[i]) {
          parent.keys.splice(i, 0, pivot);
          parent.values.splice(i, 0, ...child.values);
          break;
        } else if (i + 1 === parent.keys.length) {
          parent.keys.push(pivot);
          parent.values.push(...child.values);
          break;
        }
      }
    }
  
    insert(key, value) {
      let parent = null;
      let child = this.root;
  
      while (!child.leaf) {
        const { child: nextChild, index } = this.find(child, key);
        parent = child;
        child = nextChild;
      }
  
      child.add(key, value);
  
      if (child.isFull()) {
        child.split();
  
        if (parent && !parent.isFull()) {
          const { index } = this.find(parent, key);
          this.merge(parent, child, index);
        }
      }
    }
  
    retrieve(key) {
      let child = this.root;
  
      while (!child.leaf) {
        const { child: nextChild } = this.find(child, key);
        child = nextChild;
      }
  
      for (let i = 0; i < child.keys.length; i++) {
        if (key === child.keys[i]) {
          return child.values[i];
        }
      }
  
      return null;
    }
  
    show() {
      this.root.show();
    }
  }
  
  