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

    public isEmpty(): boolean {
        var blankCanvas = document.createElement('canvas');
        blankCanvas.width = this.canvas.width;
        blankCanvas.height = this.canvas.height;
        return blankCanvas.toDataURL() == this.canvas.toDataURL();
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

    private drawImage(base64: string): void {
        var image = new Image();
        image.onload = () => {
            this.canvasContext.drawImage(image, 0, 0);
        };
        image.src = 'data:image/png;base64,' + base64;
    }

    private drawLine(point1: Point, point2: Point): void {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo.apply(this.canvasContext, point1);
        this.canvasContext.lineTo.apply(this.canvasContext, point2);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    }

    private handleStart (event: any) {
        event.preventDefault();
        this.previousPoint = this.currentPoint;
        this.currentPoint = this.getPoint(event);

        this.flag = this.dotFlag = true;

        if (this.dotFlag) {
            this.canvasContext.beginPath();
            this.canvasContext.fillRect(this.currentPoint[0], this.currentPoint[1], 2, 2);
            this.canvasContext.closePath();
            this.dotFlag = false;
        }
    }

    private handleEnd (event: any) {
        event.preventDefault();
        this.flag = false;
    }

    private handleMove (event: any) {
        event.preventDefault();
        if (this.flag) {
            this.previousPoint = this.currentPoint;
            this.currentPoint = this.getPoint(event);
            this.drawLine(this.previousPoint, this.currentPoint);
        }
    }

    private getPoint(event: any): Point {
        var touch = event.touches && event.touches[0];
        var clientX = touch && touch.clientX || event.clientX;
        var clientY = touch && touch.clientY || event.clientY;
        return [
            clientX - this.canvas.offsetLeft + Math.round(window.scrollX),
            clientY - this.canvas.offsetTop + Math.round(window.scrollY)
        ]
    }
}

type Point = [number, number];

interface Options {
    strokeStyle: string;
    lineWidth: number;
}