export class VirtualGrid<T> {
  private container: HTMLElement;
  private items: T[];
  private itemsPerRow: number;
  private rowHeight: number;
  private renderRow: (rowItems: T[], rowIndex: number) => HTMLElement;
  
  private listWrapper: HTMLDivElement;
  private paddingTopEl: HTMLDivElement;
  private paddingBottomEl: HTMLDivElement;

  constructor(options: {
    container: HTMLElement;
    items: T[];
    itemsPerRow: number;
    rowHeight: number;
    renderRow: (rowItems: T[], rowIndex: number) => HTMLElement;
  }) {
    this.container = options.container;
    this.items = options.items;
    this.itemsPerRow = options.itemsPerRow;
    this.rowHeight = options.rowHeight;
    this.renderRow = options.renderRow;

    // Set container styles
    this.container.style.position = "relative";
    this.container.style.overflowY = "auto";

    // Setup DOM structure inside container
    this.container.innerHTML = "";
    
    this.paddingTopEl = document.createElement("div");
    this.listWrapper = document.createElement("div");
    this.paddingBottomEl = document.createElement("div");

    this.container.appendChild(this.paddingTopEl);
    this.container.appendChild(this.listWrapper);
    this.container.appendChild(this.paddingBottomEl);

    // Bind scroll handler
    this.container.addEventListener("scroll", () => this.update());
    this.update();
  }

  public updateItems(newItems: T[]) {
    this.items = newItems;
    this.update();
  }

  public update() {
    const scrollTop = this.container.scrollTop;
    const clientHeight = this.container.clientHeight;
    
    // Chunk items into rows
    const rows: T[][] = [];
    for (let i = 0; i < this.items.length; i += this.itemsPerRow) {
      rows.push(this.items.slice(i, i + this.itemsPerRow));
    }

    const totalRows = rows.length;

    // Calculate visible rows with a buffer of 2 rows above/below
    const startRowIndex = Math.max(0, Math.floor(scrollTop / this.rowHeight) - 2);
    const endRowIndex = Math.min(totalRows - 1, Math.ceil((scrollTop + clientHeight) / this.rowHeight) + 2);

    // Compute padding heights
    const paddingTop = startRowIndex * this.rowHeight;
    const paddingBottom = Math.max(0, (totalRows - 1 - endRowIndex) * this.rowHeight);

    this.paddingTopEl.style.height = `${paddingTop}px`;
    this.paddingBottomEl.style.height = `${paddingBottom}px`;

    // Empty list wrapper and append only active rows
    this.listWrapper.innerHTML = "";

    for (let r = startRowIndex; r <= endRowIndex; r++) {
      if (rows[r]) {
        const rowEl = this.renderRow(rows[r], r);
        this.listWrapper.appendChild(rowEl);
      }
    }
  }

  public destroy() {
    this.container.removeEventListener("scroll", () => this.update());
    this.container.innerHTML = "";
  }
}
