import { statSync, readdirSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'
import { TreeNode } from './TreeNode'

export interface INodeProps {
  path: string,
  name?: string,
  ext?: string,
  isDir?: boolean
}

export function buildDirectoryTree (dir: string, filter: (node: TreeNode<INodeProps>) => boolean = () => true): TreeNode<INodeProps> {
  if (!existsSync(dir))
    throw new Error(`Directory ${dir} does not exist`)

  if (!statSync(dir).isDirectory())
    throw new Error(`${dir} is not a directory`)

  function recursivelyBuildTree (node: TreeNode<INodeProps>): void {
    const children = readdirSync(node.value.path)
      .map(d => {
        const path = join(node.value.path, d)
        const ext = extname(d)
        const name = basename(d, ext)
        const isDir = statSync(path).isDirectory()

        return new TreeNode({ path, name, ext, isDir })
      })
      .filter(filter)

    for (const child of children) {
      if (child.value.isDir) {
        recursivelyBuildTree(child)
        if (child.isLeaf)
          continue
      }
      
      node.add(child)
    }
  }

  const rootNode = new TreeNode({ path: dir })
  recursivelyBuildTree(rootNode)

  return rootNode
}

export function replacePlaceholders (template: string,...values: Array<string | object>): string {
  if (!values.length)
    return template

  for (const [ index, value ] of values.entries()) {

    switch (typeof value) {
      case 'object':
        for (const [ i, v ] of Object.entries(value) as Array<[string, string]>) {
          const regex = new RegExp(`(?<!\\\\)\\$\\{${i}\\}`, 'gi')
          template = template.replace(regex, v)
        }

        break
      case 'string':
        const regex = new RegExp(`(?<!\\\\)\\$\\{${index}\\}`, 'gi')
        template = template.replace(regex, value)
    }
    
  }

  return template
}
