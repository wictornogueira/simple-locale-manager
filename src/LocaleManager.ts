import { Locale } from './Locale'
import { TreeNode } from './TreeNode'
import { buildDirectoryTree, INodeProps } from './Utils'

function filter (node: TreeNode<INodeProps>) {
  return node.value.isDir! || ['.json', '.js', '.ts'].includes(node.value.ext!)
}

export class LocaleManager {
  defaultDir?: string
  private _locales: Map<string, Locale>

  constructor (defaultDir?: string) {
    this.defaultDir = defaultDir

    this._locales = new Map()

    this._init()
  }

  private _init () {
    this.defaultDir && this.loadAll(this.defaultDir)
  }

  load (node: TreeNode<INodeProps>) {
    const name = node.value.name!

    if (this._locales.has(name))
      throw new Error(`Locale ${name} already loaded`)

    this._locales.set(name, new Locale(node))
  }

  loadAll (dir: string) {
    const dirTree = buildDirectoryTree(dir, filter)
    for (const child of dirTree.children)
      this.load(child)
  }

  get (key: string, language: string, fallback: string[] = []): any {
    for (const lang of [language, ...fallback]) {
      const locale = this._locales.get(lang)

      if (locale) {
        const value = locale.get(key)
        if (value)
          return value
      }
    }

    throw new Error (`Could not find key ${key}`)
  }

  getLocale (language: string): Locale | null {
    return this._locales.get(language) || null
  }

  get langs () {
    return Array.from(this._locales.keys())
  }
}
