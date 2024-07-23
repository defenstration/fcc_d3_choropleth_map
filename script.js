const urlEducation = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const urlCounty = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"


d3.select('body')
    .append('h1')
    .attr('id', 'title')
    .text("fCC D3 Choropleth Map")

d3.select('body')
    .append('h3')
    .attr('id', 'description')
    .text('Choropleth map of counties with their percentages of bachelors graduates')

d3.select('body')
    .append('g')
    .attr('id', 'tooltip')
    .attr('opacity', 0)
    .attr('height', 50)
    .attr('width', 150)
    .attr('fill', 'white')


const tooltip = d3.select('#tooltip')

const h = 800
const w = 1600
const path = d3.geoPath()
const projection = d3.geoMercator()
                        .scale(70)
                        .center([0, 20])
                        .translate([w / 2, h / 2])

const eduData = d3.json(urlEducation)
const countyData = d3.json(urlCounty)

const legendScale = [0, 5, 10, 15, 20, 25, 50]

const colorScale = d3.scaleThreshold()
                        .domain(legendScale)
                        .range(d3.schemeRdPu[7])

const svg = d3.select('body')
                .append('svg')
                .attr('height', h)
                .attr('width', w)



Promise.all([eduData, countyData])
    .then(data => ready(data[0], data[1]))

const ready = (education, county) => {
    const countyTopo = topojson.feature(county, county.objects.counties).features
    
    const eduTopo = new Map(education.map(d => [d.fips, d.bachelorsOrHigher]))

    const fipsCountyMap = education.map(d => [d.fips, `${d.area_name}, ${d.state}`])

    svg.append('g')
        .selectAll('path')
        .data(countyTopo)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('data-education', d => eduTopo.get(d.id))
        .attr('data-fips', d => d.id)
        .attr('data-county', d => fipsCountyMap.find(i => i[0] === d.id)[1])
        .attr('class', 'county')
        .attr('fill', d => {
            const educationNum = eduTopo.get(d.id)
            return educationNum ? colorScale(educationNum) : 'green'
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('mouseover', (event, d) => {
            const educationNum = eduTopo.get(d.id)
            tooltip.transition().style('display', "block")
            tooltip
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px')
            .attr('data-education', educationNum)
            .html(`County: ${fipsCountyMap.find(i => i[0] === d.id)[1]}, Percentage ${educationNum}`); 
        })
        .on('mouseout', () => {
            tooltip.transition().style('display', 'none');
            })
}

const legend = d3.select('body')
                    .append('svg')
                    .attr('id', 'legend')
                    .attr('height', 75)
                    .attr('width', 250)



legend.selectAll('rect')
        .data(legendScale)
        .enter()
        .append('rect')
        .attr('width', 250 / legendScale.length)
        .attr('height', 75)
        .attr('x', (d, i) => i * 250 / legendScale.length)
        .attr('fill', colorScale)