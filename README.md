# ChartVisualizer

Loads CSV data and uses SVG.JS to display a financial chart.

## Documentation
* https://svgjs.dev/docs/3.0/getting-started/

## Livedemo
* https://gentle-travesseiro-22683e.netlify.app/

# Timeline

## [4] Trend labeling
* Right sidebar changed to bottom bar
* Added EURUSD 1M 10 pip Renko bricks from 2023-09 to 2024-02
* "Buy Pressure : Sell Pressure" numbers on each block that increment buy on an up block and sell on a down block
* Each number decays by a percentage and a constant value per block
* Decay values can be set by spin inputs
* Draw colors on each block to identify trend.
* If buy pressure is larger than sell pressure during an upbar, hold a long. Reverse for sell pressure.

## [3] Plotting Renko Chart
* Added CSV data of EURUSD 1H 10 pip Renko bricks from 2020-2024
* Draw Renko bricks 10 units by 10 units
* Draw thin lines every 10 pips, thick lines every 100 pips
* Hover over brick shows date and values
* Pan and Zoom control
* Reset button in footer to reset view

## [2] Add font, create page layout
* Load Google font Roboto
* Create "Header Content Footer" grid layout
* Split Content into SVG area and right sidebar

## [1] Basic setup
* Created initial index html/css/js files in public_html directory
* SVG3.0 library is loaded and SVG.on() used to delay until the DOM is loaded

## [0] Initial commit
* Created new blank Github project

# License
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.