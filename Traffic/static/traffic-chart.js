const ctx = document.getElementById('trafficChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [{
            label: 'Traffic Congestion Level (%)',
            data: [75, 80, 85, 70, 90, 60, 50],
            borderColor: 'cyan',
            backgroundColor: 'rgba(0, 255, 255, 0.3)',
            borderWidth: 2
        }]
    },
});
