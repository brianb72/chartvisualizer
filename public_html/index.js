import { RenkoPlotter } from './renko_plotter'

// Wait for DOM to load before starting
console.log('Waiting for DOM...')
SVG.on(document, 'DOMContentLoaded', function() {
    console.log('...DOM has loaded, ready.')
    let renko = new RenkoPlotter()

})