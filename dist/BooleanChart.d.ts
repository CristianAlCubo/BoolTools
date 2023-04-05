import { BooleanTree } from "./BooleanTree";
export interface Data {
    [key: string]: string | number;
}
export declare class BooleanChart {
    private tree;
    data: Data[];
    constructor(tree: BooleanTree);
    print(): void;
    private calculateChart;
    private inputPermutations;
}
