// Mii Class: Represents a Mii
class Mii{
    constructor (name, level, status, exp, dislike) {
        this.name = name;
        this.level = level;
        this.status = status; // added to capture the 'happy or sad'
        this.exp = exp; // captures the 0-100% progression
        this.dislike = dislike;
    }
}

// Ui Class: Handle UI Tasks
class UI {
    // static displayedMiis() {
    //     // Mock data
    //     const StoredMiis = [
    //         {
    //             name: '1',
    //             level: '3',
    //             status: 'happy',
    //             exp: '75',
    //             dislike: 'cheese'
    //         },
    //          {
    //             name: 'allen',
    //             level: '2',
    //             status: 'sad',
    //             exp: '20',
    //             dislike: 'peppers'
    //         },
    //          {
    //             name: 'vegeta',
    //             level: '9',
    //             status: 'happy',
    //             exp: '95',
    //             dislike: 'cake'
    //         }
    //     ];
    static displayedMiis() {
        if (allMiis.length === 0) {
            allMiis = [
                { name: 'vegeta', level: '9', status: 'happy', exp: '95', dislike: 'cake' }
            ];
        }
        document.querySelector('#mii-list').innerHTML = '';
        allMiis.forEach((mii, index) => UI.addMiiToList(mii, index));
    }
    
    //     StoredMiis.forEach((mii) => UI.addMiiToList(mii));
    // }

    static addMiiToList(mii, index) {
        const list = document.querySelector('#mii-list');
        const row = document.createElement('tr');
        row.dataset.index = index;

        //Formats the output for the "Happiness" column
        const statusEmoji = mii.status === 'happy' ? '😊 Happy' : '😥 Sad';
        const displayStatus = `${statusEmoji} (${mii.exp}%)`;

        row.innerHTML = `
        <td>${mii.name}</td>
        <td>${mii.level}</td>
        <td>${displayStatus}</td>
        <td>${mii.dislike || 'None'}</td>
        <td>
            <a href= "#" class="btn btn-info btn-sm edit me-1">O</a>
            <a href= "#" class="btn btn-danger btn-sm delete">X</a>
        </td>
        `;

        list.appendChild(row);
    }

    static editMii(el) {
        if(el.classList.contains('edit')) {
            // Will build edit function later
        }
    }

    static deleteMii(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#level').value = '';
        document.querySelector('#mii-status').value = 'happy';
        document.querySelector('#exp').value = '50';
        document.querySelector('#slider-value').textContent = '50'; // Reset our text label too!
        document.querySelector('#exp').style.setProperty('--range-progress', '50%');
        document.querySelector('#dislike').value = '';

    }
}

// Store Class: Handles Storage
class Store {
    static getMiis() {
        return allMiis;
    }
}

let allMiis = [];


// Dom elements (grab once to use in multiple events)
const slider = document.querySelector('#exp');
const sliderValue = document.querySelector('#slider-value');
const statusSelect = document.querySelector('#mii-status');


// Event Display Mii (show mii in list), slider load to fill 50% before interaction
document.addEventListener('DOMContentLoaded', () => {
    UI.displayedMiis();
    slider.style.setProperty('--range-progress', `${slider.value}%`);
});

// Event: Update slider value as user moves it
slider.addEventListener('input', (e) => {
    sliderValue.textContent = e.target.value;
    slider.style.setProperty('--range-progress', `${e.target.value}%`);
});

// Slider color filter (based on status)
statusSelect.addEventListener('change', (e) => {
    if (e.target.value === 'sad') {
        // Switch to Sad Blue (bg-info)
        slider.classList.remove('range-happy');
        slider.classList.add('range-sad');
    } else {
        // Switch back to Happy Green (bg-success)
        slider.classList.remove('range-sad');
        slider.classList.add('range-happy'); 
    }
});

// Event: Add a Mii
document.querySelector('#mii-form').addEventListener('submit', (e) => {
    //  Prevent actual submit
    e.preventDefault();

    // Get form values
    const name = document.querySelector('#name').value.trim();
    const level = document.querySelector('#level').value.trim();
    const status = statusSelect.value; // Cleaned up: using our DOM selector
    const exp = slider.value;          // Cleaned up: using our DOM selector
    const dislike = document.querySelector('#dislike').value.trim();

    // Validate 
    if(name === '' || level === '') {
        alert('Please fill in Name and Level');
    } else {
        // Instatiate mii
    const mii = new Mii(name, level, status, exp, dislike);

    // Add mii to UI
    allMiis.push(mii);
    UI.addMiiToList(mii, allMiis.length - 1);

    // Clear fields 
    UI.clearFields();

    // Reset the slider background color classes back to happy green
    slider.classList.remove('range-sad');
    slider.classList.add('range-happy');
    } 
});


// Event: Edit a Mii

// Event: Remove a Mii and Edit Mii
let currentEditIndex = null;

document.querySelector('#mii-list').addEventListener('click', (e) => {
    // Prevent standard link jump anchor behavior
    if(e.target.classList.contains('delete') || e.target.classList.contains('edit')) {
        e.preventDefault();
    }
     if (e.target.classList.contains('edit')) {
        const row = e.target.closest('tr');
        currentEditIndex = row.dataset.index;
        const mii = allMiis[currentEditIndex];

        document.querySelector('#edit-name').value = mii.name;
        document.querySelector('#edit-level').value = mii.level;
        document.querySelector('#edit-status').value = mii.status;
        document.querySelector('#edit-exp').value = mii.exp;
        document.querySelector('#edit-slider-value').textContent = mii.exp;
        document.querySelector('#edit-dislike').value = mii.dislike;
    }

    UI.deleteMii(e.target);
});

document.querySelector('#save-edit-btn').addEventListener('click', () => {
    const mii = allMiis[currentEditIndex];
    mii.name = document.querySelector('#edit-name').value.trim();
    mii.level = document.querySelector('#edit-level').value.trim();
    mii.status = document.querySelector('#edit-status').value;
    mii.exp = document.querySelector('#edit-exp').value;
    mii.dislike = document.querySelector('#edit-dislike').value.trim();

    UI.displayedMiis(); // re-render whole table with updated data

    // Close the modal programmatically
    bootstrap.Modal.getInstance(document.querySelector('#editModal')).hide();
});

// Event: Sort Mii