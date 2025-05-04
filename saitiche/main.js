// ==================== ОБЩИЕ ФУНКЦИИ ====================
function showTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }
  const selectedTab = document.getElementById(tabId);
  if (selectedTab !== null) {
    selectedTab.classList.add("active");
  } else {
    console.log('Вкладка с id "' + tabId + '" не найдена.');
  }
}

function handleButtonClick(tabId) {
  const buttons = document.querySelectorAll(".header__nav-button");
  buttons.forEach((button) => button.classList.remove("active"));

  const clickedButton = document.querySelector(
    `.header__nav-button[onclick*="${tabId}"]`
  );
  if (clickedButton) {
    clickedButton.classList.add("active");
    clickedButton.focus();
  }
  showTab(tabId);
}

// ==================== ВКЛАДКА "ЗАГРУЗКА ОЦЕНОК" ====================
function updateFileName() {
  const fileInput = document.getElementById("file-upload");
  const fileNameText = document.getElementById("file-name");

  if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    fileNameText.textContent = fileName;
  } else {
    fileNameText.textContent = "Файл не выбран";
  }
}

function createPreviewRow(columns) {
  const row = document.createElement("tr");
  row.className = "table-preview__row";
  columns.forEach((column) => {
    const cell = document.createElement("td");
    cell.className = "table-preview__data";
    cell.textContent = column.trim();
    row.appendChild(cell);
  });
  return row;
}

function uploadFile() {
  const fileInput = document.getElementById("file-upload");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target.result;
      const rows = fileContent.split("\n");
      const previewTableBody = document.querySelector("#file-preview tbody");
      const addTableBody = document.querySelector("#file-add tbody");

      previewTableBody.innerHTML = "";
      addTableBody.innerHTML = "";

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (row) {
          const columns = row.split(";");
          const previewRow = createPreviewRow(columns);
          const addRow = createEditableRow(columns);
          previewTableBody.appendChild(previewRow);
          addTableBody.appendChild(addRow);
        }
      }
    };
    reader.readAsText(file, "windows-1251");
  } else {
    alert("Файл не выбран");
  }
}

function clearFileUpload() {
  const previewTableBody = document.querySelector("#file-preview tbody");
  const addTableBody = document.querySelector("#file-add tbody");

  previewTableBody.innerHTML = `
      <tr class="table-preview__row">
        <td class="table-preview__data"></td>
        <td class="table-preview__data"></td>
        <td class="table-preview__data"></td>
        <td class="table-preview__data"></td>
        <td class="table-preview__data"></td>
        <td class="table-preview__data"></td>
        <td class="table-preview__data"></td>
      </tr>
    `;

  addTableBody.innerHTML = `
      <tr>
        <td><input type="text" class="table-edit__input"></td>
        <td><input type="text" class="table-edit__input"></td>
        <td><input type="text" class="table-edit__input"></td>
        <td><input type="text" class="table-edit__input"></td>
        <td><input type="text" class="table-edit__input"></td>
        <td><input type="text" class="table-edit__input"></td>
        <td><input type="text" class="table-edit__input"></td>
        <td><button class="delete-button">Х</button></td>
      </tr>
    `;

  const fileInput = document.getElementById("file-upload");
  fileInput.value = "";
  updateFileName();
}

// ==================== ВКЛАДКА РЕДАКТИРОВАНИЕ ====================
function createEditableRow(columns) {
  const row = document.createElement("tr");
  columns.forEach((column, index) => {
    const cell = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.value = column.trim();
    input.classList.add("table-edit__input");

    if (index >= 2) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^1-5]/g, "");
        if (input.value > 5) input.value = 5;
        if (input.value < 1 && input.value !== "") input.value = 1;
      });
    }
    cell.appendChild(input);
    row.appendChild(cell);
  });

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    const addTableBody = document.querySelector("#file-add tbody");
    if (addTableBody.children.length > 1) {
      row.remove();
    } else {
      alert("Нельзя удалить последнюю строку");
    }
  });
  deleteCell.appendChild(deleteButton);
  row.appendChild(deleteCell);
  return row;
}

function addNewRow() {
  const addTableBody = document.querySelector("#file-add tbody");
  const columnsCount =
    document.querySelector("#file-add thead tr").children.length;
  const newRow = document.createElement("tr");

  for (let i = 0; i < columnsCount; i++) {
    const cell = document.createElement("td");
    const input = document.createElement("input");
    input.classList.add("table-edit__input");
    input.type = "text";

    if (i >= 2) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^1-5]/g, "");
        
        const numericValue = parseInt(input.value, 10);
        if (isNaN(numericValue)) input.value = "1"; 
        else if (numericValue > 5) input.value = "5";
        else if (numericValue < 1) input.value = "1";
      });
    }
    cell.appendChild(input);
    newRow.appendChild(cell);
  }

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    if (addTableBody.children.length > 1) {
      newRow.remove();
    } else {
      alert("Нельзя удалить последнюю строку");
    }
  });

  const deleteCell = document.createElement("td");
  deleteCell.appendChild(deleteButton);
  newRow.appendChild(deleteCell);
  addTableBody.appendChild(newRow);
}

function downloadTable() {
  const addTableBody = document.querySelector("#file-add tbody");
  const rows = Array.from(addTableBody.querySelectorAll("tr"));

  const headerRow = [
    "ФИО",
    "Класс",
    "История",
    "Русский",
    "Математика",
    "Литература",
    "Музыка",
  ];

  const csvContent = [];
  csvContent.push(headerRow.join(";"));

  rows.forEach((row) => {
    const inputs = Array.from(row.querySelectorAll("input"));
    const rowData = inputs.map((input) => input.value.trim());
    csvContent.push(rowData.join(";"));
  });

  const csvString = csvContent.join("\n");
  const bom = "\uFEFF";
  const csvWithBom = bom + csvString;
  const csvBlob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });

  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(csvBlob);
  downloadLink.download = "Новый журнал.csv";
  downloadLink.click();
}

// Инициализация кнопок для вкладки редактирования
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("add-row-button")
    .addEventListener("click", addNewRow);
  document
    .getElementById("download-button")
    .addEventListener("click", downloadTable);
  addNewRow(); // Добавляем первую строку по умолчанию
});

// ==================== ВКЛАДКА "статистика" ====================
function collectTableData(subjectIndex) {
  const tableAdd = document.querySelector("#file-add tbody");
  const rows = Array.from(tableAdd.querySelectorAll("tr"));

  const ocenkiklassa = {};
  const allScores = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td input");
    if (cells.length > subjectIndex) {
      const className = cells[1].value.trim();
      const score = parseInt(cells[subjectIndex].value.trim(), 10);
      if (!isNaN(score)) {
        if (!ocenkiklassa[className]) {
          ocenkiklassa[className] = [];
        }
        ocenkiklassa[className].push(score);
        allScores.push(score);
      }
    }
  });
  return { ocenkiklassa, allScores };
}

function calculateAverage(scores) {
  if (scores.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }
  return total / scores.length;
}

function calculateMedian(scores) {
  if (scores.length === 0) return 0;
  let sorted = [];
  for (let i = 0; i < scores.length; i++) {
    sorted.push(scores[i]);
  }
  sorted.sort(function (a, b) {
    return a - b;
  });
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function kolvoocen(scores, value) {
  let count = 0;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] === value) {
      count++;
    }
  }
  return count;
}
function procentka(scores, value) {
  let count = 0;
  let a = scores.length;
  let b = 0;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] === value) {
      count++;
    }
  }
  b = (count / a)*100;
  return b;
}

function updateClassStatsTable(ocenkiklassa) {
  const tableBody = document.querySelector("#table_stats_classes tbody");
  tableBody.innerHTML = "";

  Object.keys(ocenkiklassa).forEach((className) => {
    const scores = ocenkiklassa[className];
    const totalStudents = scores.length;
    const average = calculateAverage(scores).toFixed(2);
    const median = calculateMedian(scores);
    const count5 = kolvoocen(scores, 5);
    const count4 = kolvoocen(scores, 4);
    const count3 = kolvoocen(scores, 3);
    const count2 = kolvoocen(scores, 2);

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${className}</td>
        <td>${average}</td>
        <td>${median}</td>
        <td>${count5} (${((count5 / totalStudents) * 100).toFixed(1)}%)</td>
        <td>${count4} (${((count4 / totalStudents) * 100).toFixed(1)}%)</td>
        <td>${count3} (${((count3 / totalStudents) * 100).toFixed(1)}%)</td>
        <td>${count2} (${((count2 / totalStudents) * 100).toFixed(1)}%)</td>
      `;
    tableBody.appendChild(row);
  });
}

function updateAllStatsTable(allScores) {
  const tableBody = document.querySelector("#table_stats_all tbody");
  tableBody.innerHTML = "";

  const totalStudents = allScores.length;
  const average = calculateAverage(allScores).toFixed(2);
  const median = calculateMedian(allScores);
  const count5 = kolvoocen(allScores, 5);
  const count4 = kolvoocen(allScores, 4);
  const count3 = kolvoocen(allScores, 3);
  const count2 = kolvoocen(allScores, 2);

  const row = document.createElement("tr");
  row.innerHTML = `
      <td>${average}</td>
      <td>${median}</td>
      <td>${count5} (${((count5 / totalStudents) * 100).toFixed(1)}%)</td>
      <td>${count4} (${((count4 / totalStudents) * 100).toFixed(1)}%)</td>
      <td>${count3} (${((count3 / totalStudents) * 100).toFixed(1)}%)</td>
      <td>${count2} (${((count2 / totalStudents) * 100).toFixed(1)}%)</td>
    `;
  tableBody.appendChild(row);
}

function handleSubjectChange() {
  const selectElement = document.querySelector("#table-stats-select");
  const subject = selectElement.value;

  const subjectIndexMap = {
    istoria: 2,
    Russkii: 3,
    mathematics: 4,
    literature: 5,
    fisra: 6,
  };

  const subjectIndex = subjectIndexMap[subject];
  if (subjectIndex !== undefined) {
    const { ocenkiklassa, allScores } = collectTableData(subjectIndex);
    updateClassStatsTable(ocenkiklassa);
    updateAllStatsTable(allScores);
  } else {
    console.error("Неверный предмет:", subject);
  }
}

// Инициализация для вкладки табличной статистики
document.addEventListener("DOMContentLoaded", function () {
  const subjectSelect = document.querySelector("#table-stats-select");
  subjectSelect.addEventListener("change", handleSubjectChange);
});

// ==================== ВКЛАДКА "ГРАФИЧЕСКАЯ СТАТИСТИКА" ====================
let ocenkiklassaChart;
let medianStatsChart;
let countStatsCharts = [];
let allStatsChart;
let grf5;
let grf4;
let grf3;
let grf2;

function updateGraphicStats(subjectIndex) {
  const { ocenkiklassa, allScores } = collectTableData(subjectIndex);
  const classLabels = Object.keys(ocenkiklassa);

  const pr5 = classLabels.map((label) => procentka(ocenkiklassa[label], 5));
  const abv5 = document.getElementById("gr5").getContext("2d");
  if (grf5) grf5.destroy();
  grf5 = new Chart(abv5, {
    type: "bar",
    data: {
      labels: classLabels,
      datasets: [{
          label: "Процент 5 по классам",
          data: pr5,
          backgroundColor: "DarkGreen",
          borderColor: "DarkGreen",
          borderWidth: 1,
        },
      ],
    },
  });

  const pr4 = classLabels.map((label) => procentka(ocenkiklassa[label], 4));
  const abv4 = document.getElementById("gr4").getContext("2d");
  if (grf4) grf4.destroy();
  grf4 = new Chart(abv4, {
    type: "bar",
    data: {
      labels: classLabels,
      datasets: [{
          label: "Процент 4 по классам",
          data: pr4,
          backgroundColor: "SeaGreen",
          borderColor: "SeaGreen",
          borderWidth: 1,
        },
      ],
    },
  });

  const pr3 = classLabels.map((label) => procentka(ocenkiklassa[label], 3));
  const abv3 = document.getElementById("gr3").getContext("2d");
  if (grf3) grf3.destroy();
  grf3 = new Chart(abv3, {
    type: "bar",
    data: {
      labels: classLabels,
      datasets: [{
          label: "Процент 3 по классам",
          data: pr3,
          backgroundColor: "DarkOrange",
          borderColor: "DarkOrange",
          borderWidth: 1,
        },
      ],
    },
  });

  const pr2 = classLabels.map((label) => procentka(ocenkiklassa[label], 2));
  const abv2 = document.getElementById("gr2").getContext("2d");
  if (grf2) grf2.destroy();
  grf2 = new Chart(abv2, {
    type: "bar",
    data: {
      labels: classLabels,
      datasets: [{
          label: "Процент 2 по классам",
          data: pr2,
          backgroundColor: "DarkRed",
          borderColor: "DarkRed",
          borderWidth: 1,
        },
      ],
    },
  });

  const classAverages = classLabels.map((label) => calculateAverage(ocenkiklassa[label]));
  const ctxClass = document.getElementById("class-stats-chart").getContext("2d");
  if (ocenkiklassaChart) ocenkiklassaChart.destroy();
  ocenkiklassaChart = new Chart(ctxClass, {
    type: "bar",
    data: {
      labels: classLabels,
      datasets: [{
          label: "Средняя оценка по классам",
          data: classAverages,
          backgroundColor: "DimGrey",
          borderColor: "DimGrey",
          borderWidth: 1,
        },
      ],
    },
  });

  const classMedians = classLabels.map((label) => calculateMedian(ocenkiklassa[label]));
  const ctxMedian = document.getElementById("median-stats-chart").getContext("2d");
  if (medianStatsChart) medianStatsChart.destroy();
  medianStatsChart = new Chart(ctxMedian, {
    type: "bar",
    data: {
      labels: classLabels,
      datasets: [{
          label: "Медиана по классам",
          data: classMedians,
          backgroundColor: "BurlyWood",
          borderColor: "BurlyWood",
          borderWidth: 1,
        },
      ],
    },
  });
  const cvet = ["none", "DarkRed", "DarkOrange", "SeaGreen", "DarkGreen"];
  const grades = [5, 4, 3, 2];
  const ctxCountElements = [ "count-stats-chart-5",
    "count-stats-chart-4",
    "count-stats-chart-3",
    "count-stats-chart-2",
  ].map((id) => document.getElementById(id).getContext("2d"));

  countStatsCharts.forEach((chart) => chart.destroy());
  countStatsCharts = grades.map((grade, index) => {
  const counts = classLabels.map((label) => kolvoocen(ocenkiklassa[label], grade));
    return new Chart(ctxCountElements[index], {
      type: "bar",
      data: {
        labels: classLabels,
        datasets: [
          {
            label: `Количество оценок ${grade} по классам`,
            data: counts,
            backgroundColor: cvet[grade-1],
            borderColor: cvet[grade-1],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: false },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  });

  // Обновляем круговую диаграмму распределения оценок
  const allLabels = ["5", "4", "3", "2"];
  const allCounts = allLabels.map((label) => kolvoocen(allScores, parseInt(label)));
  const ctxAll = document.getElementById("all-stats-chart").getContext("2d");
  if (allStatsChart) allStatsChart.destroy();
  allStatsChart = new Chart(ctxAll, {
    type: "pie",
    data: {
      labels: allLabels,
      datasets: [
        {
          label: "Распределение оценок",
          data: allCounts,
          backgroundColor: [
            "DarkGreen",
            "SeaGreen",
            "DarkOrange",
            "DarkRed",
          ],
          borderColor: [
            "DarkGreen",
            "SeaGreen",
            "DarkOrange",
            "DarkRed",
          ],
          borderWidth: 1,
        },
      ],
    },
  });
//график 2
}
// Инициализация для вкладки графической статистики
document.addEventListener("DOMContentLoaded", function () {
  const graphicStatsSelect = document.querySelector("#graphic-stats select");
  graphicStatsSelect.addEventListener("change", () => {
    const subjectIndexMap = {
      istoria: 2,
      Russkii: 3,
      mathematics: 4,
      literature: 5,
      fisra: 6,
    };
    const subjectIndex = subjectIndexMap[graphicStatsSelect.value];
    if (subjectIndex !== undefined) {
      updateGraphicStats(subjectIndex);
    }
  });
});
