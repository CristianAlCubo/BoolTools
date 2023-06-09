import { Parser } from "./BoolStatementEngine"
import { BooleanChart } from "./BooleanChart"

export interface InputNodes{
    [inputKey : string] : VariableNode
}
export class Nodo {
    public truthValue!: boolean
    public symbol: string
    public subtreeSymbol!: string
    public left: OperatorNode | VariableNode | null;
    public right: OperatorNode | VariableNode | null;

    constructor(left: OperatorNode | VariableNode | null| undefined, right: OperatorNode | VariableNode | null| undefined, symbol: string){
        this.symbol = symbol
        if(left == undefined || right == undefined){
            this.left = null
            this.right = null
        }else{
            this.left = left
            this.right = right
        }
    }
}

export class OperatorNode extends Nodo{

    constructor(symbol: string){
        super(null, null,symbol)
        this.truthValue = false
    }

    public calculateValue(){
        this.left?.calculateValue()
        this.right?.calculateValue()
        if(this.symbol === '+'){
            this.truthValue = (this.left?.truthValue|| this.right?.truthValue) ? true : false
        }else if(this.symbol === '¬'){
            this.truthValue = !(this.right?.truthValue)
        }else if(this.symbol === '*'){
            this.truthValue = (this.left?.truthValue && this.right?.truthValue) ? true : false
        }else if(this.symbol === '°'){
            this.truthValue = (this.left?.truthValue != this.right?.truthValue) ? true : false
        }
    }   
}

export class VariableNode extends Nodo{
    constructor(truthValue: boolean, symbol: string){
        super(null,null,symbol)
        this.truthValue = truthValue
    }

    public calculateValue() : boolean{
        this.subtreeSymbol = this.symbol
        return this.truthValue
    }
}   



export class BooleanTree{
    public bredthNodes : (VariableNode|OperatorNode)[]
    public root: OperatorNode
    public inputs: InputNodes = {}
    public outputs: OperatorNode[] = []
    public rawStatement: string
    public postfixStatement: string
    public explicitOperatorsStmnt: string
    public truthChart:BooleanChart

    private parser:Parser 
    constructor(stmnt: string){
        this.parser = new Parser(stmnt)
        this.root = this.parser.treeRoot
        this.rawStatement = stmnt
        this.postfixStatement = this.parser.postFixStmnt
        this.explicitOperatorsStmnt = this.parser.preFormatStmnt
        this.calculateValue()
        this.initSubTreeSymbols(this.root)
        this.bredthNodes = this.bredthTraversal()
        this.defineInputsAndOutputsNodes()
        this.truthChart = new BooleanChart(this)
    }

    public info(){
        console.table([{
            'inputs':Object.keys(this.inputs).toString(),
            'outputs':this.outputs.map(x => x.symbol).toString(),
            'breadth':this.bredthNodes.map(x => x.symbol).toString(),
            'breadth (subtrees)':this.bredthNodes.map(x => x.subtreeSymbol).toString()
        }])
    }
    public calculateValue(){
        this.root.calculateValue()
    }

    public print(){
        this.recursivePrint(this.root, 0)
    }

    public bredthTraversal() : (VariableNode|OperatorNode)[]{
        let nodeList : (VariableNode|OperatorNode)[]= []
        let nodeQueue : (VariableNode|OperatorNode)[] = []
        nodeQueue.push(this.root)
        while(nodeQueue.length > 0){
            const node = nodeQueue[0]
            nodeList.push(node)
            nodeQueue.shift()
            if(node.left) nodeQueue.push(node.left)
            if(node.right) nodeQueue.push(node.right)
        }
        return nodeList
    }

    private recursivePrint(treeRoot: OperatorNode | VariableNode | null, depth: number){
        if(treeRoot){
            const nodeType = treeRoot.constructor.prototype.constructor.name
            const nodeData = `${treeRoot.symbol}`
            if(depth == 0){
                console.log(nodeData)
             }else if(depth >= 1){
                console.log(`${'|     '.repeat(depth-1)}|---- ${nodeData}`)
             }
            depth++
            if(nodeType == 'OperatorNode'){
                 this.recursivePrint(treeRoot.left, depth)
                 this.recursivePrint(treeRoot.right, depth)
            }
        }
    }

    private initSubTreeSymbols(root:Nodo|null){
        if(root){
            this.initSubTreeSymbols(root.left)
            this.initSubTreeSymbols(root.right)
            if(root.symbol === '+'){
                root.subtreeSymbol = root.left?.subtreeSymbol + root.symbol + root.right?.subtreeSymbol
            }else if(root.symbol === '¬'){
                root.subtreeSymbol = (root.right?.subtreeSymbol.length == 1 ) ? root.symbol + root.right?.subtreeSymbol : root.symbol + '(' +root.right?.subtreeSymbol+')'
            }else if(root.symbol === '*' || root.symbol === '°'){
                root.subtreeSymbol = (root.right?.subtreeSymbol.length == 1  ) ? root.left?.subtreeSymbol + root.symbol + root.right?.subtreeSymbol : root.left?.subtreeSymbol + root.symbol + root.right?.subtreeSymbol
                let left = ''
                let right = ''
                if(root.left?.subtreeSymbol.length){
                    left = (root.left.subtreeSymbol.length > 1) ? `(${root.left.subtreeSymbol})` : root.left.subtreeSymbol
                }
                if(root.right?.subtreeSymbol.length){
                    right = (root.right.subtreeSymbol.length > 1) ? `(${root.right.subtreeSymbol})` : root.right.subtreeSymbol
                }
                root.subtreeSymbol = left+root.symbol+right
            }else{
                root.subtreeSymbol = root.symbol
            }
        }
    }

    private defineInputsAndOutputsNodes(){
        for (const node of this.bredthNodes) {
            if(node.left == null && node.right == null && /^[a-zA-Z]+$/.test(node.symbol)){
                let repeatedInput = false
                for (const inputKey of Object.keys(this.inputs)) {
                    if(inputKey == node.symbol){
                        repeatedInput = true
                    }
                }
                if(!repeatedInput) this.inputs[node.symbol] = node as VariableNode
            }else{
                this.outputs.push(node as OperatorNode)
            }
        }
    }
}

