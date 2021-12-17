export class TreeNode<T> {
  value: T
  children: TreeNode<T>[]
  
  constructor (value: T) {
    this.value = value
    this.children = []
  }

  add (node: TreeNode<T>) {
    this.children.push(node);
  }

  get isLeaf () {
    return !this.children.length;
  }
}
