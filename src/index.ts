export class Sign {
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private options: Options;
    private flag: boolean = false;
    private dotFlag: boolean = false;
    private previousPoint: Point = [0, 0];
    private currentPoint: Point = [0, 0];

    public constructor(canvas: HTMLCanvasElement, options: Options) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d");
        this.options = options;
        this.canvasContext.strokeStyle = this.options.strokeStyle || 'black';
        this.canvasContext.fillStyle = this.options.strokeStyle || 'black';
        this.canvasContext.lineWidth = this.options.lineWidth || 2;
        this.canvas.addEventListener("mousemove", this.handleMove.bind(this), false);
        this.canvas.addEventListener("touchmove", this.handleMove.bind(this), false);

        this.canvas.addEventListener("mousedown", this.handleStart.bind(this), false);
        this.canvas.addEventListener("touchstart", this.handleStart.bind(this), false);

        this.canvas.addEventListener("mouseup", this.handleEnd.bind(this), false);
        this.canvas.addEventListener("mouseout", this.handleEnd.bind(this), false);
        this.canvas.addEventListener("touchend", this.handleEnd.bind(this), false);
        this.canvas.addEventListener("touchcancel", this.handleEnd.bind(this), false);
    }

    public erase(): void {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public toDataURL (): string {
        return this.canvas.toDataURL();
    }

    public toBase64 (): string {
        return this.canvas.toDataURL().replace(/data:image\/.*;base64,/, '');
    }

    private drawLine(point1: Point, coordinates2: Point): void {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo.apply(this.canvasContext, point1);
        this.canvasContext.lineTo.apply(this.canvasContext, coordinates2);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    }

    private handleStart (event: any) {
        this.previousPoint = this.currentPoint;
        this.currentPoint = [event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop];

        this.flag = this.dotFlag = true;

        if (this.dotFlag) {
            this.canvasContext.beginPath();
            this.canvasContext.fillRect(this.currentPoint[0], this.currentPoint[1], 2, 2);
            this.canvasContext.closePath();
            this.dotFlag = false;
        }
    }

    private handleEnd (event: any) {
        this.flag = false;
    }

    private handleMove (event: any) {
        if (this.flag) {
            this.previousPoint = this.currentPoint;
            this.currentPoint = [event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop];
            this.drawLine(this.previousPoint, this.currentPoint);
        }
    }
}

type Point = [number, number];

interface Options {
    strokeStyle: string;
    lineWidth: number;
}