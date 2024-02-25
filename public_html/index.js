import { RenkoPlotter } from './renko_plotter.js'

let renko = null;

const onTrendDecayChange = (ev, which) => {
    if (renko != null) { 
        renko.onTrendDecayChange(ev, which) 
    } else {
        console.log('onTrendDecayChange fired when renko is null')
    }
}


// Wait for DOM to load before starting
console.log('Waiting for DOM...')
SVG.on(document, 'DOMContentLoaded', function() {
    console.log('...DOM has loaded, ready.')
    renko = new RenkoPlotter()
    const trendDecayPercent = document.getElementById('trend-decay-percent');
    trendDecayPercent.addEventListener('input', ev => { onTrendDecayChange(ev, 'percent') });
    const trendDecayConstant = document.getElementById('trend-decay-constant');
    trendDecayConstant.addEventListener('input', ev => { onTrendDecayChange(ev, 'constant') });
})


