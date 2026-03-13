// Load existing entries from the phone/browser storage
let trackers = JSON.parse(localStorage.getItem('fee_trackers')) || [];

function addEntry() {
    const purpose = document.getElementById('purpose').value;
    const days = parseFloat(document.getElementById('duration').value);

    // Rule: At least 2 days
    if (!purpose || isNaN(days) || days < 2) {
        alert("Please enter a purpose and a duration of at least 2 days.");
        return;
    }

    const expiryTime = Date.now() + (days * 24 * 60 * 60 * 1000);
    
    const newEntry = {
        id: Date.now(),
        purpose: purpose,
        expiry: expiryTime
    };

    trackers.push(newEntry);
    localStorage.setItem('fee_trackers', JSON.stringify(trackers));
    
    // Clear inputs
    document.getElementById('purpose').value = '';
    document.getElementById('duration').value = '';
    
    renderTrackers();
}

function deleteEntry(id) {
    trackers = trackers.filter(t => t.id !== id);
    localStorage.setItem('fee_trackers', JSON.stringify(trackers));
    renderTrackers();
}

function renderTrackers() {
    const list = document.getElementById('entriesList');
    list.innerHTML = '';

    trackers.forEach(tracker => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteEntry(${tracker.id})">&times;</button>
            <h3>${tracker.purpose}</h3>
            <div class="timer" id="timer-${tracker.id}">Calculating...</div>
        `;
        list.appendChild(card);
    });
}

function updateClocks() {
    const now = Date.now();
    
    trackers.forEach(tracker => {
        const timerEl = document.getElementById(`timer-${tracker.id}`);
        if (!timerEl) return;

        const diff = tracker.expiry - now;

        if (diff <= 0) {
            timerEl.innerText = "EXPIRED";
            timerEl.style.color = "#ff4444";
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingDays = Math.floor(totalHours / 24);

        // Logic for display formats
        if (remainingDays >= 1) {
            timerEl.innerText = `${remainingDays} Days remaining`;
        } else if (totalHours >= 2) {
            // Show hh:mm
            const h = totalHours.toString().padStart(2, '0');
            const m = (totalMinutes % 60).toString().padStart(2, '0');
            timerEl.innerText = `${h}:${m}`;
        } else {
            // Show hh:mm:ss for last 2 hours
            const h = totalHours.toString().padStart(2, '0');
            const m = (totalMinutes % 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            timerEl.innerText = `${h}:${m}:${s}`;
        }
    });
}

// Update every second
setInterval(updateClocks, 1000);

// Initial display
renderTrackers();
updateClocks();
