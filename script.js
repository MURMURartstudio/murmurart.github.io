// 學生資料（清空狀態）
const students = [
    {
        name: "小明",
        phone: "13800138000",
        avatar: "https://picsum.photos/300/300?random=1",
        works: [],
        courses: { total: 0, completed: 0, remaining: 0, records: [] }
    }
];

let currentStudent = students[0];
let filteredCourses = [];
let selectedCourseIndexes = [];

window.onload = function () {
    renderGallery();
    renderCourseProgress();
};

// 切換頁面
function showSection(sec) {
    document.getElementById("gallerySection").style.display = sec === "gallery" ? "block" : "none";
    document.getElementById("courseSection").style.display = sec === "course" ? "block" : "none";
    document.querySelectorAll(".nav-menu a").forEach((a, i) => {
        a.classList.toggle("active", i === (sec === "gallery" ? 0 : 1));
    });
}

// 畫廊
function renderGallery() {
    const g = document.getElementById("artGallery");
    g.innerHTML = `<img src="${currentStudent.avatar}" style="width:180px;border-radius:50%;border:5px solid #879acb;">`;
}

// 課程統計
function updateCourseStatistics() {
    const records = currentStudent.courses.records;
    currentStudent.courses.total = records.length;
    currentStudent.courses.completed = records.filter(r => r.status === "completed").length;
    currentStudent.courses.remaining = records.length - currentStudent.courses.completed;
}

// 渲染課程表
function renderCourseProgress() {
    updateCourseStatistics();
    const cs = currentStudent.courses;
    document.getElementById("totalCourses").innerText = cs.total;
    document.getElementById("completedCourses").innerText = cs.completed;
    document.getElementById("remainingCourses").innerText = cs.remaining;
    const rate = cs.total ? Math.round((cs.completed / cs.total) * 100) : 0;
    document.getElementById("completionRate").innerText = rate + "%";
    document.getElementById("progressBar").style.width = rate + "%";
    filteredCourses = [...cs.records];
    renderTable();
}

function renderTable() {
    const body = document.getElementById("courseTableBody");
    body.innerHTML = "";
    filteredCourses.forEach((rec, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" onclick="toggleSelect(${idx})"></td>
            <td>${rec.date}</td>
            <td>${rec.time}</td>
            <td>${rec.theme}</td>
            <td>${rec.status}</td>
            <td>${rec.note || ""}</td>
            <td>
                <button onclick="deleteCourse(${idx})">刪除</button>
            </td>
        `;
        body.appendChild(tr);
    });
}

// 一鍵清空所有課程
function clearAllCourses() {
    if (!confirm("確定要清空所有課程？無法復原！")) return;
    currentStudent.courses.records = [];
    renderCourseProgress();
    alert("已清空所有課程！");
}

// 刪除單筆
function deleteCourse(index) {
    if (!confirm("確定刪除？")) return;
    currentStudent.courses.records.splice(index, 1);
    renderCourseProgress();
}

// 全選/取消
function toggleSelectAll() {
    const checked = document.getElementById("selectAll").checked;
    selectedCourseIndexes = checked ? filteredCourses.map((_, i) => i) : [];
    renderTable();
}

function toggleSelect(i) {
    const idx = selectedCourseIndexes.indexOf(i);
    idx === -1 ? selectedCourseIndexes.push(i) : selectedCourseIndexes.splice(idx, 1);
}

function clearSelection() {
    selectedCourseIndexes = [];
    document.getElementById("selectAll").checked = false;
    renderTable();
}

// 批次狀態
function batchUpdateStatus(status) {
    selectedCourseIndexes.forEach(i => {
        currentStudent.courses.records[i].status = status;
    });
    renderCourseProgress();
    clearSelection();
}

function batchUpdateLeaveStatus() {
    batchUpdateStatus("leave");
}

// 搜索
function searchCourses() {
    const txt = document.getElementById("courseSearch").value.toLowerCase();
    filteredCourses = currentStudent.courses.records.filter(r =>
        r.date.includes(txt) || r.theme.toLowerCase().includes(txt)
    );
    renderTable();
}

// 回到頂部
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// 彈窗（保留結構）
function openAddCourseModal() {}
function openBatchAddModal() {}
