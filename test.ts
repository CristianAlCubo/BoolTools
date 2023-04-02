import {OperatorNode, VariableNode, BooleanTree} from './Node'


//(x+y)(wy)

let x = new VariableNode(false,'x')
let y = new VariableNode(true,'y')
let w = new VariableNode(false,'w')

let nand1 = new OperatorNode('*',null,null)
let nand2 = new OperatorNode('*',null,null)
let nand3 = new OperatorNode('*',null,null)
let nor = new OperatorNode('+',null,null)

nor.left = x
nor.right = y
nand3.left = w
nand3.right = y

nand2.left = w
nand2.right = nand3

nand1.left = nor
nand1.right = nand2

let bTree = new BooleanTree(nand1)

bTree.calculateValue()
bTree.print()



