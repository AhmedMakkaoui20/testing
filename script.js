// Function to load CSV data and display it in a table
function loadCSVData() {
    fetch('/data')
      .then(response => response.text())
      .then(data => {
        const rows = data.trim().split('\n');
        const tableBody = document.querySelector('#data-table tbody');
        tableBody.innerHTML = ''; // Clear existing table data
  
        rows.forEach((row, index) => {
          const cells = row.split(',');
          const rowElement = document.createElement('tr');
  
          cells.forEach((cell, cellIndex) => {
            const cellElement = document.createElement(index === 0 ? 'th' : 'td');
            cellElement.textContent = cell;
            rowElement.appendChild(cellElement);
          });
  
          // Add delete button
          const actionCell = document.createElement('td');
          if (index !== 0) { // Skip adding delete button for header row
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.dataset.line = index; // Store the line number for delete action
            deleteButton.addEventListener('click', function () {
              deleteRow(index);
            });
            actionCell.appendChild(deleteButton);
          }
          rowElement.appendChild(actionCell);
  
          tableBody.appendChild(rowElement);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  // Function to delete a row from the CSV
  function deleteRow(lineNumber) {
    fetch(`/delete/${lineNumber}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Record successfully deleted!');
        loadCSVData(); // Reload table data
      } else {
        alert('Error deleting record.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  
  // Handle form submission
  document.getElementById('data-form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    // Get input values
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const occupation = document.getElementById('occupation').value;
  
    // Create a form data object
    const formData = { name, age, occupation };
  
    // Send form data to the server via POST request
    fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Data successfully saved to CSV!');
        loadCSVData(); // Reload table data
      } else {
        alert('Error saving data.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
    // Clear the form
    document.getElementById('data-form').reset();
  });
  
  // Load the initial CSV data when the page loads
  window.onload = loadCSVData;
  