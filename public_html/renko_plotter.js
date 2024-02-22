import { RENKO_DATA } from "./renko_data.js"

export class RenkoPlotter { 
    constructor() {
        this.renko_data = RENKO_DATA; // Load static data here for testing, later on it will come in on the constructor
        this.renko_stats = this.getRenkoDataStats();
        this.state = {
            selectedBar: undefined, // Which bar by integer row position in dataset is selected
        }

        this.svgGroups = {
            mainSVG: undefined,     // The main SVG() object attached to the DOM
            transform: undefined,   // Subgroup of main, receives D3 transform
            // All other layers are under transform
            levels: undefined,       // Price level lines
            blocks: undefined,        // Drawn blocks

        }
        
        let startCreate = performance.now()
        this.createSVG();        


        const zoomButton = document.getElementById('button-zoom')
        zoomButton.onclick = () => this.resetChart();
        let finishCreate = performance.now()
        console.log(`Created RenkoPlotter in ${finishCreate - startCreate}ms`)    
    }


    resetChart() {
        this.svgGroups.mainSVG.viewbox(525, -12750, 1000, 1000);
        const header = document.getElementById('header-text');
        header.innerText = 'EURUSD 1H Renko';
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


    createSVG() {
        const gr = this.svgGroups;

        // Create the main SVG object that will hold all drawing
        gr.mainSVG = SVG()
            .size("100%", "100%")
            .viewbox(525, -12750, 1000, 1000)
            .panZoom()

        // Create the layers that will hold drawn elements
        gr.blocks = gr.mainSVG.group().attr("id", "blocks")
        gr.lines = gr.mainSVG.group().attr("id", "lines")


        // Draw renko blocks onto the blocks layer
        for (let i = 0; i < this.renko_data.length; ++i) {
            const row = this.renko_data[i];
            gr.blocks.rect(10, ((row.High * 10000) - (row.Low * 10000)))
                .move(i * 10, row.High * -10000)
                .stroke('black')
                .fill(row['uptrend'] ? 'blue' : 'red')
                .on('mouseover', () => {
                    const header = document.getElementById('header-text');
                    const dateString = new Date(row.Date);
                    header.innerText = `${dateString.toDateString()}: ${row.High} ${row.Low} ${row.uptrend}`;
                })
            }


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