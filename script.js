let targetAmount = 0;
let chart = null;
const userId = 'yuta'; // Ganti dengan auth userId nanti

// Simpan Target
function saveTarget() {
  targetAmount = parseInt(document.getElementById('targetInput').value) || 0;
  updateProgress();
  fetch('/api/save-target', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target: targetAmount, userId })
  }).then(() => loadData());
}

// Tambah Data
function addData() {
  const date = document.getElementById('dateInput').value;
  const mas = parseInt(document.getElementById('masInput').value) || 0;
  const adek = parseInt(document.getElementById('adekInput').value) || 0;
  fetch('/api/tambahkan-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bulan: date, mas, adek, userId })
  }).then(() => {
    document.getElementById('dateInput').value = '';
    document.getElementById('masInput').value = '';
    document.getElementById('adekInput').value = '';
    loadData();
  });
}

// Load Data dan Update UI
function loadData() {
  fetch(`/api/get-data?userId=${userId}`)
    .then(res => res.json())
    .then(data => {
      updateTable(data);
      updateProgress(data);
      updateChart(data);
    });
}

// Update Tabel
function updateTable(data) {
  const tbody = document.getElementById('tabunganTable').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';
  data.forEach(item => {
    const row = tbody.insertRow();
    row.innerHTML = `<td>${item.bulan}</td><td>${item.mas}</td><td>${item.adek}</td><td>${item.total}</td><td><button onclick="deleteData(${item.id})">Hapus</button></td>`;
  });
}

// Update Progress Bar
function updateProgress(data = []) {
  const totalSaved = data.reduce((sum, item) => sum + item.total, 0);
  const percentage = targetAmount ? (totalSaved / targetAmount) * 100 : 0;
  document.getElementById('progressFill').style.width = `${Math.min(percentage, 100)}%`;
  document.getElementById('progressText').textContent = `${percentage.toFixed(1)}% (Rp ${totalSaved} / Rp ${targetAmount})`;
}

// Update Grafik
function updateChart(data) {
  const ctx = document.getElementById('tabunganChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(item => item.bulan),
      datasets: [{
        label: 'Total Tabungan (Rp)',
        data: data.map(item => item.total),
        backgroundColor: '#f4a261'
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

// Delete Data (opsional, perlu endpoint tambahan)
function deleteData(id) {
  fetch(`/api/delete-data?id=${id}&userId=${userId}`, { method: 'DELETE' })
    .then(() => loadData());
}

// Export (placeholder, butuh library seperti SheetJS/PDFMake)
function exportExcel() { alert('Fitur export Excel belum diimplementasi'); }
function exportPDF() { alert('Fitur export PDF belum diimplementasi'); }

// Load data saat halaman dimuat
window.onload = loadData;
