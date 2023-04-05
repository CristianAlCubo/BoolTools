import { BooleanChart } from "./BooleanChart";
export interface InputNodes {
    [inputKey: string]: VariableNode;
}
export declare class Nodo {
    truthValue: boolean;
    symbol: string;
    subtreeSymbol: string;
    left: OperatorNode | VariableNode | null;
    right: OperatorNode | VariableNode | null;
    constructor(left: OperatorNode | VariableNode | null | undefined, right: OperatorNode | VariableNode | null | undefined, symbol: string);
}
export declare class OperatorNode extends Nodo {
    constructor(symbol: string);
    calculateValue(): void;
}
export declare class VariableNode extends Nodo {
    constructor(truthValue: boolean, symbol: string);
    calculateValue(): boolean;
}
export declare class BooleanTree {
    bredthNodes: (VariableNode | OperatorNode)[];
    root: OperatorNode;
    inputs: InputNodes;
    outputs: OperatorNode[];
    rawStatement: string;
    postfixStatement: string;
    explicitOperatorsStmnt: string;
    truthChart: BooleanChart;
    private parser;
    constructor(stmnt: string);
    info(): void;
    calculateValue(): void;
    print(): void;
    bredthTraversal(): (VariableNode | OperatorNode)[];
    private recursivePrint;
    private initSubTreeSymbols;
    private defineInputsAndOutputsNodes;
}
