/**
 * Fabric.js ambient type declarations.
 *
 * Fabric is loaded as a global via CDN (<script src="fabric.min.js">).
 * These declarations give TypeScript just enough surface area to stop
 * complaining while keeping the runtime behaviour identical.
 */

declare namespace fabric {
  interface ICanvasOptions {
    backgroundColor?: string;
    selection?: boolean;
    preserveObjectStacking?: boolean;
    [key: string]: any;
  }

  interface IObjectOptions {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    fill?: string | CanvasGradient;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    angle?: number;
    scaleX?: number;
    scaleY?: number;
    flipX?: boolean;
    flipY?: boolean;
    originX?: string;
    originY?: string;
    name?: string;
    id?: string;
    rx?: number;
    ry?: number;
    radius?: number;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string | number;
    fontStyle?: string;
    underline?: boolean;
    lineHeight?: number;
    charSpacing?: number;
    textAlign?: string;
    clipPath?: Object;
    absolutePositioned?: boolean;
    subTargetCheck?: boolean;
    hasControls?: boolean;
    hasBorders?: boolean;
    evented?: boolean;
    src?: string;
    [key: string]: any;
  }

  class Object {
    type: string;
    left: number;
    top: number;
    width: number;
    height: number;
    fill: string | CanvasGradient;
    opacity: number;
    scaleX: number;
    scaleY: number;
    flipX: boolean;
    flipY: boolean;
    angle: number;
    shadow: Shadow | null;
    canvas: Canvas;
    name: string;

    set(key: string | Record<string, any>, value?: any): this;
    get(key: string): any;
    setCoords(): this;
    clone(callback: (cloned: Object) => void, propertiesToInclude?: string[]): void;
    toObject(propertiesToInclude?: string[]): any;
    scale(value: number): this;
    getBoundingRect(): { left: number; top: number; width: number; height: number };
    getScaledWidth(): number;
    getScaledHeight(): number;
  }

  class Rect extends Object {
    constructor(options?: IObjectOptions);
  }

  class Circle extends Object {
    constructor(options?: IObjectOptions);
  }

  class Triangle extends Object {
    constructor(options?: IObjectOptions);
  }

  class Polygon extends Object {
    constructor(points: Array<{ x: number; y: number }>, options?: IObjectOptions);
  }

  class Line extends Object {
    constructor(points: number[], options?: IObjectOptions);
  }

  class IText extends Object {
    fontFamily: string;
    fontSize: number;
    fontWeight: string | number;
    fontStyle: string;
    underline: boolean;
    lineHeight: number;
    charSpacing: number;
    textAlign: string;
    text: string;
    constructor(text: string, options?: IObjectOptions);
  }

  class Image extends Object {
    constructor(element: HTMLImageElement, options?: IObjectOptions);
    static fromURL(url: string, callback: (img: Image) => void, imgOptions?: any): void;
    scaleToWidth(value: number): this;
    scaleToHeight(value: number): this;
  }

  class Path extends Object {
    constructor(path: string, options?: IObjectOptions);
  }

  class Group extends Object {
    subTargetCheck: boolean;
    constructor(objects: Object[], options?: IObjectOptions);
    getObjects(type?: string): Object[];
    toActiveSelection(): ActiveSelection;
  }

  class ActiveSelection extends Object {
    constructor(objects: Object[], options?: IObjectOptions);
    toGroup(): Group;
    forEachObject(callback: (obj: Object) => void): void;
  }

  class Shadow {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
    constructor(options?: { color?: string; blur?: number; offsetX?: number; offsetY?: number });
  }

  class StaticCanvas {
    backgroundColor: string;
    constructor(el: string | HTMLCanvasElement | null, options?: ICanvasOptions);
    loadFromJSON(json: any, callback: () => void, reviver?: Function): this;
    toDataURL(options?: { format?: string; multiplier?: number; [key: string]: any }): string;
    dispose(): void;
  }

  class Canvas extends StaticCanvas {
    wrapperEl: HTMLDivElement;
    isDrawingMode: boolean;
    selection: boolean;
    defaultCursor: string;
    viewportTransform: number[];

    constructor(el: string | HTMLCanvasElement, options?: ICanvasOptions);

    add(...objects: Object[]): this;
    remove(...objects: Object[]): this;
    renderAll(): this;
    getObjects(type?: string): Object[];
    forEachObject(callback: (obj: Object) => void): void;

    getActiveObject(): Object | null;
    getActiveObjects(): Object[];
    setActiveObject(obj: Object): this;
    discardActiveObject(): this;

    getWidth(): number;
    getHeight(): number;
    setWidth(value: number): this;
    setHeight(value: number): this;

    getZoom(): number;
    setZoom(value: number): this;
    zoomToPoint(point: { x: number; y: number }, value: number): this;
    getVpCenter(): { x: number; y: number };
    relativePan(point: { x: number; y: number }): this;

    setBackgroundColor(color: string, callback: () => void): this;

    bringForward(obj: Object, intersecting?: boolean): this;
    sendBackwards(obj: Object, intersecting?: boolean): this;
    bringToFront(obj: Object): this;
    sendToBack(obj: Object): this;

    getPointer(e: Event): { x: number; y: number };

    toJSON(propertiesToInclude?: string[]): any;

    on(event: string, handler: (opt?: any) => void): this;
    off(event: string, handler?: (opt?: any) => void): this;
  }

  namespace util {
    function enlivenObjects(objects: any[], callback: (results: Object[]) => void, namespace?: string): void;
    function groupSVGElements(elements: Object[], options?: any): Object;
  }

  function loadSVGFromString(svg: string, callback: (results: Object[], options: any) => void): void;
}
