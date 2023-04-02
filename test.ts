import {OperatorNode, VariableNode, BooleanTree} from './Node'


//(x+y)(wy)

const notn = new OperatorNode('¬',null,null)
const nor = new OperatorNode('+',null,null)
const nand = new OperatorNode('*',null,null)
const w = new VariableNode(false,'w')
const x = new VariableNode(false,'x')

nor.left = x
nor.right = w

notn.right = nor

nand.left = x
nand.right = notn

let bTree = new BooleanTree(nand)

bTree.calculateValue()
bTree.print()

