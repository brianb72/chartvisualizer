import { RENKO_DATA } from "./renko_data_1m.js"

export class RenkoPlotter { 
    constructor() {
        this.trendDecayPercent = 0.1;
        this.trendDecayConstant = 1;
        this.renko_data = RENKO_DATA; // Load static data here for testing, later on it will come in on the constructor
        this.renko_stats = this.getRenkoDataStats();
        this.state = {
            selectedBar: undefined, // Which bar by integer row position in dataset is selected
        }

        this.svgGroups = {
            mainSVG: undefined,     // The main SVG() object attached to the DOM
            transform: undefined,   // Subgroup of main, receives D3 transform
            // All other layers are under transform
            counts: undefined,       // Numbers drawn on blocks
            curves: undefined,       // Linedraw curves like moving averages
            levels: undefined,       // Price level lines
            blocks: undefined,        // Drawn blocks

        }
        
        let startCreate = performance.now()
        this.createSVG();        


        const zoomButton = document.getElementById('button-zoom')
        zoomButton.onclick = () => this.resetChart();
        let finishCreate = performance.now()
        console.log(`Created RenkoPlotter in ${finishCreate - startCreate}ms`)    
        this.resetChart()
    }


    resetChart() {
        this.svgGroups.mainSVG.viewbox(4565, -11100, 658, 658)

        const header = document.getElementById('header-text');
        header.innerText = 'EURUSD 1M Renko';
    }

    getRenkoDataStats() {
        let highest = Number.MIN_VALUE;
        let lowest = Number.MAX_VALUE;
        for (let i = 0; i < this.renko_data.length; ++i) {
            const row = this.renko_data[i];
            highest = Math.max(row['High'], highest);
            lowest = Math.min(row['Low'], lowest);
        }
        return {
            'Highest': highest,
            'Lowest': lowest,
            'Count': this.renko_data.length,
        }
    }

    onTrendDecayChange(ev, which) {
        const data = parseFloat(ev['data']);
        if (data == NaN) { return; }
        if (which == "percent") { this.trendDecayPercent = data; }
        else if (which == "constant") { this.trendDecayConstant = data; }
        else { 
            console.log(`onTrendDecayChange unknown which \"${which}\"`)
        }
        this.drawCounts()
    }


    drawCurves() {
        const gCurves = this.svgGroups.curves;
        gCurves.clear();
        
        for (let i = 1; i < this.renko_data.length; ++i) {
            const row = this.renko_data[i];
            const last50ma = this.renko_data[i-1].ma_50 * -10000;
            const last100ma = this.renko_data[i-1].ma_100 * -10000;
            const last200ma = this.renko_data[i-1].ma_200 * -10000;
            const cur50ma = this.renko_data[i].ma_50 * -10000;
            const cur100ma = this.renko_data[i].ma_100 * -10000;
            const cur200ma = this.renko_data[i].ma_200 * -10000;
            const last_x = (i - 1) * 10;
            const cur_x = i * 10;
            if (last50ma && cur50ma) gCurves.line(last_x, last50ma, cur_x, cur50ma).stroke({ width: 2, color: 'green' })
            if (last100ma && cur100ma) gCurves.line(last_x, last100ma, cur_x, cur100ma).stroke({ width: 5, color: 'blue' })
            if (last200ma && cur200ma) gCurves.line(last_x, last200ma, cur_x, cur200ma).stroke({ width: 8, color: 'red' })
        
        }
    }


    drawCounts() {
        let block_up = 0;
        let block_down = 0;
        this.svgGroups.counts.clear();

        for (let i = 0; i < this.renko_data.length; ++i) {
            const row = this.renko_data[i];
            const block_y = row.High * -10000;
            const block_x = i * 10;
            const block_width = ((row.High * 10000) - (row.Low * 10000))
            const block_height = 10;
            block_up = Math.max(0, block_up - this.trendDecayConstant - block_up * this.trendDecayPercent)
            block_down = Math.max(0, block_down - this.trendDecayConstant - block_down * this.trendDecayPercent)
            if (row['uptrend']) { block_up += this.trendDecayConstant * 2 }
            else { block_down += this.trendDecayConstant * 2 }
            
            if ((row['uptrend'] && Math.round(block_up) > Math.round(block_down)) || (!row['uptrend'] && Math.round(block_down) > Math.round(block_up))) {
                this.svgGroups.counts.rect(block_width, block_height)
                .move(block_x, block_y)
                .stroke('black')
                .fill(row['uptrend'] ? 'blue' : 'red')
                .on('mouseover', () => {
                    const header = document.getElementById('header-text');
                    const dateString = new Date(row.Date);
                    header.innerText = `${dateString.toDateString()}: ${row.High} ${row.Low} ${row.uptrend}`;
                })

            }


            this.svgGroups.counts
                .plain(`${Math.round(block_up)}:${Math.round(block_down)}`)
                .font({
                    family: "Verdana",
                    size: 3.5,
                    fill: "Black",
                    anchor: "middle",
                    weight: "bold",
                })
                .attr("text-rendering", "optimizeSpeed")
                .amove(block_x + block_width / 2, block_y + block_height * 0.65)
        }

    }

    createSVG() {
        const gr = this.svgGroups;

        // Create the main SVG object that will hold all drawing
        gr.mainSVG = SVG()
            .size("100%", "100%")
            .viewbox(4565, -11100, 658, 658)
            .panZoom()

        // Create the layers that will hold drawn elements
        gr.lines = gr.mainSVG.group().attr("id", "lines")
        gr.blocks = gr.mainSVG.group().attr("id", "blocks")
        gr.curves = gr.mainSVG.group().attr("id", "curves")
        gr.counts = gr.mainSVG.group().attr("id", "counts")

        // Draw renko blocks onto the blocks layer
        for (let i = 0; i < this.renko_data.length; ++i) {
            const row = this.renko_data[i];
            const block_y = row.High * -10000;
            const block_x = i * 10;
            const block_width = ((row.High * 10000) - (row.Low * 10000))
            const block_height = 10;
            gr.blocks.rect(block_width, block_height)
                .move(block_x, block_y)
                .stroke('black')
                .fill(row['uptrend'] ? '#2DA4C2' : '#C34A2C')
                .on('mouseover', () => {
                    const header = document.getElementById('header-text');
                    const dateString = new Date(row.Date);
                    header.innerText = `${dateString.toDateString()}: ${row.High} ${row.Low} ${row.uptrend}`;
                })
        }

        this.drawCurves()
        this.drawCounts()

        // Draw price level lines onto the lines layer
        for (let i = 5000; i < 20000; i += 100) {
            gr.lines.line(0, -i, this.renko_data.length * 10, -i)
                .stroke({ 
                    width: i % 1000 == 0 ? 5 : 2,
                    color: 'black'
                })
        }

        // Attach SVG to DOM
        gr.mainSVG.addTo('#content-svg')

    }
}
