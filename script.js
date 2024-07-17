const urlEducation = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const urlCounty = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

d3.select('body')
    .append('h1')
    .attr('id', 'title')
    .text("fCC D3 Choropleth Map")