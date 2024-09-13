const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const listElement = document.getElementById('option-list');
  listElement.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
      const params = event.target.dataset.params;
      ipcRenderer.send('launch-sap', params);
    }
  });
});
