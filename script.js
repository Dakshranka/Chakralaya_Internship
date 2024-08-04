let typeChart, groupChart; 
async function fetchData() {
    const response = await fetch('https://random-data-api.com/api/v2/blood_types?size=100&response_type=json');
    const data = await response.json();
    return data;
}
function processData(data) {
    const typeCounts = {};
    const groupCounts = {};
    data.forEach(item => {
        const type = item.type;
        const group = item.group;
        if (!typeCounts[type]) {
            typeCounts[type] = 0;
        }
        typeCounts[type]++;
        if (!groupCounts[group]) {
            groupCounts[group] = 0;
        }
        groupCounts[group]++;
    });
    return { typeCounts, groupCounts };
}
function createCharts(typeCounts, groupCounts) {
    const typeCtx = document.getElementById('typeChart').getContext('2d');
    const groupCtx = document.getElementById('groupChart').getContext('2d');
    if (typeChart) typeChart.destroy(); 
    if (groupChart) groupChart.destroy(); 
    typeChart = new Chart(typeCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                label: '# of Blood Types',
                data: Object.values(typeCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    groupChart = new Chart(groupCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(groupCounts),
            datasets: [{
                label: '# of Blood Groups',
                data: Object.values(groupCounts),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
async function main() {
    const data = await fetchData();
    const { typeCounts, groupCounts } = processData(data);
    populateFilters(data);
    createCharts(typeCounts, groupCounts);
    document.getElementById('typeFilter').addEventListener('change', () => filterData(data));
    document.getElementById('groupFilter').addEventListener('change', () => filterData(data));
}
function populateFilters(data) {
    const types = [...new Set(data.map(item => item.type))];
    const groups = [...new Set(data.map(item => item.group))];
    const typeFilter = document.getElementById('typeFilter');
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
    const groupFilter = document.getElementById('groupFilter');
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupFilter.appendChild(option);
    });
}
function filterData(data) {
    const typeFilter = document.getElementById('typeFilter').value;
    const groupFilter = document.getElementById('groupFilter').value;
    const filteredData = data.filter(item => {
        return (typeFilter === 'all' || item.type === typeFilter) &&
               (groupFilter === 'all' || item.group === groupFilter);
    });
    const { typeCounts, groupCounts } = processData(filteredData);
    createCharts(typeCounts, groupCounts);
}
main();
