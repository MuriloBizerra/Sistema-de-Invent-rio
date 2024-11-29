// script.js

// Carregar inventário do LocalStorage
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    renderTable(inventory);
    updateChart(inventory);
  }
  
  // Salvar inventário no LocalStorage
  function saveInventory(inventory) {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }
  
  // Renderizar a tabela de inventário
  function renderTable(inventory) {
    const tableBody = document.querySelector('#inventory-table tbody');
    tableBody.innerHTML = '';
    
    inventory.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${new Date(item.date).toLocaleDateString()}</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Atualizar gráfico com dados do inventário
  function updateChart(inventory) {
    const chartData = inventory.reduce((acc, item) => {
      if (acc[item.name]) {
        acc[item.name] += item.quantity;
      } else {
        acc[item.name] = item.quantity;
      }
      return acc;
    }, {});
  
    const labels = Object.keys(chartData);
    const data = Object.values(chartData);
  
    const ctx = document.getElementById('product-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Quantidade',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
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
  
  // Filtrar inventário
  function filterInventory() {
    const nameFilter = document.getElementById('filter-name').value.toLowerCase();
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
  
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    const filteredInventory = inventory.filter(item => {
      const itemDate = new Date(item.date);
      const isNameMatch = item.name.toLowerCase().includes(nameFilter);
      const isDateMatch = (!startDate || itemDate >= new Date(startDate)) && 
                          (!endDate || itemDate <= new Date(endDate));
      
      return isNameMatch && isDateMatch;
    });
  
    renderTable(filteredInventory);
    updateChart(filteredInventory);
  }
  
  // Adicionar produto ao inventário
  document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const quantity = parseInt(document.getElementById('product-quantity').value, 10);
    const date = document.getElementById('product-date').value;
  
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    inventory.push({ name, quantity, date });
    saveInventory(inventory);
    
    document.getElementById('product-form').reset();
    loadInventory();
  });
  
  // Aplicar filtros
  document.getElementById('apply-filters').addEventListener('click', filterInventory);
  
  // Inicializar
  loadInventory();
  