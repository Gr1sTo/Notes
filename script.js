const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const charCount = document.getElementById('charCount');

const MAX_CHAR_COUNT = 200;

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updateCharCount() {
    const currentLength = noteInput.value.length;
    const remaining = MAX_CHAR_COUNT - currentLength;

    charCount.textContent = `${remaining} символів залишилось`;

    if (remaining <= 20) {
        charCount.classList.add('warning');
    } else {
        charCount.classList.remove('warning');
    }

    if (currentLength > MAX_CHAR_COUNT) {
        addNoteBtn.disabled = true;
        charCount.textContent = `Перевищено ліміт (${MAX_CHAR_COUNT} символів)`;
    } else {
        addNoteBtn.disabled = false;
    }
}

function loadNotes() {
    notesList.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.textContent = note.text;

        const rotate = (Math.random() * 10 - 5).toFixed(2) + 'deg';
        li.style.setProperty('--rotate', rotate);

        const pinIcon = document.createElement('i');
        pinIcon.classList.add('fa', 'fa-thumbtack', 'fa-bounce');

        pinIcon.style.color = note.color;

        pinIcon.onclick = () => {
            notes.splice(index, 1);
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes();
        };

        li.appendChild(pinIcon);
        notesList.appendChild(li);
    });

    new Sortable(notesList, {
        onEnd(evt) {
            const updatedNotes = [];
            notesList.querySelectorAll('li').forEach((item) => {
                const noteText = item.textContent.replace(/\s+$/, '');
                const noteColor = item.querySelector('i').style.color;
                updatedNotes.push({
                    text: noteText,
                    color: noteColor
                });
            });
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
        }
    });
}

addNoteBtn.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    if (noteText === '') return;

    const randomColor = getRandomColor();

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({
        text: noteText,
        color: randomColor
    });
    localStorage.setItem('notes', JSON.stringify(notes));
    noteInput.value = '';
    updateCharCount();
    loadNotes();
});

noteInput.addEventListener('input', updateCharCount);

function updateTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('currentTime').textContent = timeString;

    const dateString = now.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateString;
}

setInterval(updateTime, 1000);

loadNotes();

updateTime();
