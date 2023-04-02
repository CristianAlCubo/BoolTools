export class Nodo {
    public symbol: string
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
    public truthValue: boolean

    constructor(symbol: string, left: OperatorNode | VariableNode | null, right: OperatorNode | VariableNode | null){
        super(left, right,symbol)
        this.truthValue = false
    }

    public calculateValue() : boolean{
        if(this.symbol === '+'){
            this.truthValue = (this.left?.calculateValue() || this.right?.calculateValue()) ? true : false
        }else if(this.symbol === '¬'){
            this.truthValue = !(this.right?.calculateValue())
        }else if(this.symbol === '*'){
            this.truthValue = (this.left?.calculateValue() && this.right?.calculateValue()) ? true : false
        }
        return this.truthValue
    }   

    
}

export class VariableNode extends Nodo{
    truthValue: boolean

    constructor(truthValue: boolean, symbol: string){
        super(null,null,symbol)
        this.truthValue = truthValue
    }

    public calculateValue() : boolean{
        return this.truthValue
    }
}   

export class BooleanTree{
    root: OperatorNode
    constructor(root: OperatorNode){
        this.root = root
    }
    public calculateValue() : boolean{
        return this.root.calculateValue()
    }

    public print(){
        this.recursivePrint(this.root, 0)
    }

    private recursivePrint(treeRoot: OperatorNode | VariableNode | null, depth: number){
        if(treeRoot){
            const nodeType = treeRoot.constructor.prototype.constructor.name
            const nodeData = `${treeRoot.symbol} (${treeRoot.truthValue})`
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
}

