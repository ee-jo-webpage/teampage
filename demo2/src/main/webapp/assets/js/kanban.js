
// ===========================
// 📌 DOM 요소 선택 및 변수 선언
// ===========================
const modal = document.getElementById('taskModal'); // 모달창 전체
const titleInput = document.getElementById('taskTitle'); // 제목 입력 필드
const descInput = document.getElementById('taskDescription'); // 설명 입력 필드
const tagInput = document.getElementById('taskTag'); // 태그 입력 필드
const tagSuggestions = document.getElementById('tagSuggestions'); // 태그 추천 목록
const startDate = document.getElementById('startDate'); // 시작일
const endDate = document.getElementById('endDate'); // 종료일

const saveBtn = document.getElementById('saveTask'); // 저장 버튼
const deleteBtn = document.getElementById('deleteTask'); // 삭제 버튼
const closeBtn = document.getElementById('closeModal'); // 닫기 버튼

const tagFilter = document.getElementById('tagFilter'); // 태그 필터 드롭다운

let currentTask = null; // 현재 클릭하거나 수정 중인 task DOM 요소
let currentList = null; // 현재 task가 위치한 리스트 DOM 요소

// 태그 색상 설정
const tagColors = ["#cc0909", "#ffb257", "#0d6efd", "#ffc107", "#c054ff", "#20c997"];
let colorIndex = 0;
const tagColorMap = {}; // {tag이름: 색상} 매핑

function getColorForTag(tag) {
    if (!tagColorMap[tag]) {
        tagColorMap[tag] = tagColors[colorIndex];
        colorIndex = (colorIndex + 1) % tagColors.length;
    }
    return tagColorMap[tag];
}

// ===========================
// 📌 태그 필터 및 추천 업데이트
// ===========================
function updateTagFilterOptions() {
    const tags = new Set();
    document.querySelectorAll('.task').forEach(task => {
        const taskTags = JSON.parse(task.dataset.tags || '[]');
        taskTags.forEach(t => tags.add(t));
    });

    tagFilter.innerHTML = '<option value="all">전체</option>';
    tags.forEach(tag => {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.textContent = tag;
        tagFilter.appendChild(opt);
    });

    updateTagSuggestions([...tags]);
}

// 태그 추천 클릭 시 입력창에 자동 추가
function updateTagSuggestions(tags) {
    tagSuggestions.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        span.addEventListener('click', () => {
            tagInput.value = (tagInput.value + ',' + tag).replace(/^,|,$/g, '').replace(/,,+/g, ',');
        });
        tagSuggestions.appendChild(span);
    });
}

// ===========================
// 📌 태그 필터 동작
// ===========================
tagFilter.addEventListener('change', () => {
    const value = tagFilter.value;
    document.querySelectorAll('.task').forEach(task => {
        const taskTags = JSON.parse(task.dataset.tags || '[]');
        task.style.display = (value === 'all' || taskTags.includes(value)) ? '' : 'none';
    });
});

// ===========================
// 📌 태스크 DOM 요소 생성 함수
// ===========================
function createTaskElement(title, desc, tags, status, start = '', end = '') {
    const task = document.createElement('div');
    task.className = 'task';

    // 제목 표시
    const titleEl = document.createElement('div');
    titleEl.className = 'task-title';
    titleEl.textContent = title;
    task.appendChild(titleEl);

    // 태그 표시
    tags.forEach(tag => {
        const tagLabel = document.createElement('div');
        tagLabel.className = 'tag';
        tagLabel.textContent = tag;
        tagLabel.style.backgroundColor = getColorForTag(tag);
        task.appendChild(tagLabel);
    });

    // task 정보 dataset에 저장
    task.dataset.title = title;
    task.dataset.description = desc;
    task.dataset.tags = JSON.stringify(tags);
    task.dataset.start = start;
    task.dataset.end = end;

    // 드래그 시작 시 현재 task 저장
    task.draggable = true;
    task.addEventListener('dragstart', () => currentTask = task);

    // 클릭 시 모달에 정보 채워 넣기
    task.addEventListener('click', () => {
        currentTask = task;
        currentList = task.parentElement;

        // 최신 dataset 값 기준으로 입력 필드 채우기
        titleInput.value = task.dataset.title || '';
        descInput.value = task.dataset.description || '';
        tagInput.value = JSON.parse(task.dataset.tags || '[]').join(', ');
        startDate.value = task.dataset.start || '';
        endDate.value = task.dataset.end || '';

        deleteBtn.style.display = 'inline-block';
        modal.classList.add('show');
    });

    return task;
}

// ===========================
// 📌 태스크 저장 (localStorage)
// ===========================
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.column').forEach(column => {
        const status = column.dataset.status;
        column.querySelectorAll('.task').forEach(task => {
            tasks.push({
                title: task.dataset.title,
                description: task.dataset.description,
                tags: JSON.parse(task.dataset.tags || '[]'),
                status: status,
                start: task.dataset.start,
                end: task.dataset.end
            });
        });
    });
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    updateTagFilterOptions();
}

// ===========================
// 📌 태스크 로딩 (localStorage)
// ===========================
function loadTasks() {
    const data = JSON.parse(localStorage.getItem('kanban-tasks')) || [];
    data.forEach(task => {
        const column = document.querySelector(`.column[data-status="${task.status}"] .task-list`);
        const newTask = createTaskElement(task.title, task.description, task.tags, task.status, task.start, task.end);
        column.appendChild(newTask);
    });
    updateTagFilterOptions();
}

// ===========================
// 📌 태스크 추가 버튼 이벤트
// ===========================
document.querySelectorAll('.add-task-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentList = btn.closest('.column').querySelector('.task-list');
        currentTask = null;
        titleInput.value = '';
        descInput.value = '';
        tagInput.value = '';
        startDate.value = '';
        endDate.value = '';
        deleteBtn.style.display = 'none';
        modal.classList.add('show');
    });
});

// ===========================
// 📌 드래그 앤 드롭 이벤트
// ===========================
document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('dragover', e => e.preventDefault());
    list.addEventListener('drop', (e) => {
        e.preventDefault();
        if (currentTask) {
            list.appendChild(currentTask);
            currentTask.classList.toggle('done', list.closest('.column').dataset.status === 'done');
            saveTasks();
        }
    });
});

// ===========================
// 📌 저장 버튼 클릭 (추가 또는 수정)
// ===========================
saveBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    const tags = tagInput.value.split(',').map(t => t.trim()).filter(Boolean);
    const start = startDate.value;
    const end = endDate.value;

    if (!title) return;

    if (currentTask) {
        // 기존 task를 수정
        currentTask.innerHTML = '';

        const titleEl = document.createElement('div');
        titleEl.className = 'task-title';
        titleEl.textContent = title;
        currentTask.appendChild(titleEl);

        tags.forEach(tag => {
            const tagLabel = document.createElement('div');
            tagLabel.className = 'tag';
            tagLabel.textContent = tag;
            tagLabel.style.backgroundColor = getColorForTag(tag);
            currentTask.appendChild(tagLabel);
        });

        currentTask.dataset.title = title;
        currentTask.dataset.description = desc;
        currentTask.dataset.tags = JSON.stringify(tags);
        currentTask.dataset.start = start;
        currentTask.dataset.end = end;

        // 🧠 dataset만으로는 모달 재오픈 시 최신값 반영 안 될 수 있음
        currentTask.setAttribute('data-start', start);
        currentTask.setAttribute('data-end', end);
    } else {
        // 새 task 생성
        const newTask = createTaskElement(title, desc, tags, currentList.closest('.column').dataset.status, start, end);
        currentList.appendChild(newTask);
    }

    saveTasks();
    modal.classList.remove('show');
});

// ===========================
// 📌 삭제 및 닫기 버튼
// ===========================
deleteBtn.addEventListener('click', () => {
    if (currentTask) {
        currentTask.remove();
        saveTasks();
    }
    modal.classList.remove('show');
});
closeBtn.addEventListener('click', () => modal.classList.remove('show'));

// ===========================
// 📌 로딩 시 태스크 불러오기
// ===========================
window.addEventListener('DOMContentLoaded', loadTasks);

// ===========================
// 📌 뷰 전환 버튼 (칸반 <-> 캘린더)
// ===========================
const kanbanView = document.getElementById('kanbanView');
const calendarView = document.getElementById('calendarView');
const kanbanBtn = document.getElementById('kanbanViewBtn');
const calendarBtn = document.getElementById('calendarViewBtn');

kanbanBtn.addEventListener('click', () => {
    kanbanView.style.display = 'block';
    calendarView.style.display = 'none';
});

calendarBtn.addEventListener('click', () => {
    kanbanView.style.display = 'none';
    calendarView.style.display = 'block';
    renderCalendar();
});

// ===========================
// 📌 FullCalendar 렌더링 함수
// ===========================
function renderCalendar() {
    const stored = JSON.parse(localStorage.getItem('kanban-tasks')) || [];

    const events = stored
        .filter(task => task.start || task.end)
        .map(task => {
            const mainTag = task.tags[0] || 'default';
            const color = getColorForTag(mainTag);

            return {
                title: task.title,
                start: task.start || task.end,
                end: task.end || task.start,
                backgroundColor: color,
                borderColor: color,
                textColor: '#fff',
                extendedProps: {
                    description: task.description,
                    tags: task.tags
                }
            };
        });

    const calendarEl = document.getElementById('calendar');
    calendarEl.innerHTML = ''; // 중복 방지

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        aspectRatio: 1.0,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        events,
        eventClick: function (info) {
            const { title, extendedProps } = info.event;
            alert(
                `📚 ${title}\n\n📝 ${extendedProps.description}\n🏷️ ${extendedProps.tags.join(', ')}`
            );
        }
    });

    calendar.render();
}