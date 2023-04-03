import { OperatorNode, VariableNode, InputNodes } from "./BooleanTree"

export class Parser{
    public rawStmnt: string
    private preFormatStmnt: string
    private parseQueue: string[] = []
    private operations: string[] = []
    private primitives: string[] = []
    private nodes: string[] = []
    private inputs: InputNodes = {}
    private outputs: OperatorNode[] = []

    private operators:string[] = ['+','*','¬']

    constructor(rawStmnt : string){
        this.rawStmnt = rawStmnt
        this.preFormat()
    }
    private preFormat(){ 
        let rawStmntArr = this.rawStmnt.split('')
        for (let i = 0; i < this.rawStmnt.length - 1; i++) {
            if(/[a-zA-Z)]/.test(rawStmntArr[i]) && /[a-zA-Z(¬]/.test(rawStmntArr[i+1])){
                this.insertAt(rawStmntArr, i+1, '*')
            }
        }
        this.preFormatStmnt = rawStmntArr.join('')
    }

    public parse(){
        this.parseQueue.push(this.removeParentheses(this.preFormatStmnt))
        while(this.parseQueue.length > 0){
            const stmnt = this.parseQueue[0]
            this.parseQueue.shift()
            if(stmnt[0] === '('){
                let operatorFound = false
                for (const operator of this.operators) {
                    let parenthesisCount = 0
                    let i = 0
                    for (const char of stmnt) {
                        if(char == '(') parenthesisCount++
                        if(char == ')') parenthesisCount--
                        if(char == operator && parenthesisCount==0){
                            const {fHalf, sHalf} = this.sliceStatement(stmnt,i)
                            this.operations.push(stmnt[i])
                            this.parseQueue.push(this.removeParentheses(fHalf))
                            this.parseQueue.push(this.removeParentheses(sHalf))
                            operatorFound = true
                            break;
                        }
                        i++;
                    }
                    if(operatorFound) break
                }
            }else{
                if(stmnt.length == 1){
                    this.primitives.push(stmnt)
                }else{
                    for (const operator of this.operators) {
                        let i = 0
                        let operatorFound = false
                        for (const char of stmnt) {
                            if(char == operator){
                                const {fHalf, sHalf} = this.sliceStatement(stmnt,i)
                                this.operations.push(stmnt[i])
                                this.parseQueue.push(this.removeParentheses(fHalf))
                                this.parseQueue.push(this.removeParentheses(sHalf))
                                operatorFound = true
                                break;
                            }
                            i++;
                        }
                        if(operatorFound) break
                    }                    
                }
            }
        }
        console.log(this.operations)
        console.log(this.primitives)
    }

    public removeParentheses(stmnt:string){
        const doubleParenthesesPattern = /^\([a-zA-Z+\*¬\(\)]+\)[+\*¬]?\([a-zA-Z+\*¬\(\)]+\)$/
        if(doubleParenthesesPattern.test(stmnt)){
            return stmnt
        }else if(stmnt[0] == '(' && stmnt[stmnt.length - 1] == ')'){
            //Remove outer parenthesis
            let parenthesisCount = 0
            for (let i = 0; i < stmnt.length - 1; i++) {
                if(stmnt[i] == '(' && stmnt[i+1] == '(') {
                    parenthesisCount++
                }else{
                    break;
                }
            } 
            if(parenthesisCount > 0) {
                stmnt = stmnt.slice(0+parenthesisCount,0-parenthesisCount)
            }else{
                stmnt = stmnt.slice(1,-1)
            }
        }
        return stmnt
}

    private sliceStatement(stmnt:string,index:number){
        const fHalf = stmnt.slice(0,index)
        const sHalf = stmnt.slice(index+1)
        return {fHalf:fHalf, sHalf:sHalf}
    }

    private insertAt<T>(array: T[], index: number, element: T): T[] {
        for (let i = array.length - 1; i >= index; i--) {
          array[i + 1] = array[i];
        }
        array[index] = element;
        return array;
      }
}