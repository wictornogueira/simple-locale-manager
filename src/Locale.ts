import { resolve } from 'path'
import { TreeNode } from './TreeNode'
import { INodeProps } from './Utils'

interface LocaleEntry { [key: string]: any }

export class Locale {
  private _rootNode: TreeNode<INodeProps>
  private _thing: LocaleEntry

  constructor (rootNode: TreeNode<INodeProps>) {
    this._rootNode = rootNode
    this._thing = {}

    this._init()
  }

  private _init () {
    function doTheThing (thing: LocaleEntry, node: TreeNode<INodeProps>) {
      if (node.isLeaf)
        return Object.assign(thing, require(resolve(node.value.path)))
      
      for (const child of node.children) {
        const name = child.value.name!
        doTheThing(name === 'index' ? thing : thing[name] = {}, child)
      }
    }

    doTheThing(this._thing, this._rootNode)
  }

  get (key: string): any {
    let thing = this._thing

    for (const index of key.split('.')) {
      thing = thing[index]

      if (!thing)
        break    
    }

    return thing
  }
}
