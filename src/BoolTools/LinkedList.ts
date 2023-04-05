export class Nodo<T> {
    public value: T;
    public next: Nodo<T> | null;
    public prev: Nodo<T> | null;
  
    constructor(value: T, next: Nodo<T> | null = null, prev: Nodo<T> | null = null) {
      this.value = value;
      this.next = next;
      this.prev = prev;
    }
  }
  
export class LinkedList<T> {
    public head: Nodo<T> | null;
    public tail: Nodo<T> | null;
    public size: number;
  
    constructor() {
      this.head = null;
      this.tail = null;
      this.size = 0;
    }
  
    public getSize(): number {
      return this.size;
    }
  
    public isEmpty(): boolean {
      return this.size === 0;
    }
  
    public addFirst(value: T): void {
      const node = new Nodo(value, this.head, null);
      if (this.head) {
        this.head.prev = node;
      }
      this.head = node;
      if (this.isEmpty()) {
        this.tail = node;
      }
      this.size++;
    }
  
    public addLast(value: T): void {
      const node = new Nodo(value, null, this.tail);
      if (this.tail) {
        this.tail.next = node;
      }
      this.tail = node;
      if (this.isEmpty()) {
        this.head = node;
      }
      this.size++;
    }
  
    public addAtIndex(index: number, value: T): void {
      if (index < 0 || index > this.size) {
        throw new Error('Index out of bounds');
      }
      if (index === 0) {
        this.addFirst(value);
      } else if (index === this.size - 1) {
        const node = new Nodo(value,this.tail,this.tail?.prev)
        if(this.tail?.prev?.next) this.tail.prev.next = node
        if(this.tail?.prev) this.tail.prev = node
        this.size++
      } else {
        let current = this.head!;
        for (let i = 0; i < index - 1; i++) {
          current = current.next!;
        }
        const node = new Nodo(value, current.next, current);
        current.next!.prev = node;
        current.next = node;
        this.size++;
      }
    }
  
    public add(value: T): void {
      this.addLast(value);
    }
  
    public addAll(collection: Iterable<T>): void {
      for (const value of collection) {
        this.addLast(value);
      }
    }

    public toString() : string{
        let node = this.head
        let text = ""
        while(node != null){
            text += node.value
            node = node.next
        }
        return text
    }

    public print(){        
        console.log(this.toString())
    }

    
    public printRelations(): void {
        let current = this.head;
        let output = '';
        while (current) {
            output += `${current.prev ? current.prev.value : 'null'} <== ${current.value} ==> ${current.next ? current.next.value : 'null'}\n`;
            current = current.next;
        }
    console.log(output);
    }
  }