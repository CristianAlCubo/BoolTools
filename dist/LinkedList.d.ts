export declare class Nodo<T> {
    value: T;
    next: Nodo<T> | null;
    prev: Nodo<T> | null;
    constructor(value: T, next?: Nodo<T> | null, prev?: Nodo<T> | null);
}
export declare class LinkedList<T> {
    head: Nodo<T> | null;
    tail: Nodo<T> | null;
    size: number;
    constructor();
    getSize(): number;
    isEmpty(): boolean;
    addFirst(value: T): void;
    addLast(value: T): void;
    addAtIndex(index: number, value: T): void;
    add(value: T): void;
    addAll(collection: Iterable<T>): void;
    toString(): string;
    print(): void;
    printRelations(): void;
}
