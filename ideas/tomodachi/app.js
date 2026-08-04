// Mii Class: Represents a Mii
class Mii{
    constructor (name, level, status, exp, dislike) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.level = level;
        this.status = status; // added to capture the 'happy or sad'
        this.exp = exp; // captures the 0-100% progression
        this.dislike = dislike;
    }
}

// Ui Class: Handle UI Tasks
class UI {
    
    static displayedMiis() {
        const miis = Store.getMiis();

        const list = document.querySelector('#mii-list');
        list.innerHTML = '';

        miis.forEach((mii) => UI.addMiiToList(mii));
        
    }
    
    

    static addMiiToList(mii, index) {
        const list = document.querySelector('#mii-list');
        const row = document.createElement('tr');
        row.dataset.id = mii.id;

        //Formats the output for the "Happiness" column
        const statusEmoji = mii.status === 'happy' ? '😊 Happy' : '😥 Sad';
        const displayStatus = `${statusEmoji} (${mii.exp}%)`;

        row.innerHTML = `
        <td>${mii.name}</td>
        <td>${mii.level}</td>
        <td>${displayStatus}</td>
        <td>${mii.dislike || 'None'}</td>
        <td>
            <a href= "#" class="btn btn-info btn-sm edit me-1">edit</a>
            <a href= "#" class="btn btn-danger btn-sm delete">delete</a>
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

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#mii-form');
        container.insertBefore(div, form);
        
        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
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
        let miis;
        if(localStorage.getItem('miis') === null) {
            miis = [];
        } else {
            miis = JSON.parse(localStorage.getItem('miis'));
        }

        return miis;
    }


    static addMii(mii) {
        const miis = Store.getMiis();

        miis.push(mii);

        localStorage.setItem('miis', JSON.stringify(miis));
    }

    static editMii(updatedMii) {
        const miis = Store.getMiis();
        const updated = miis.map(mii => mii.id === updatedMii.id ? updatedMii : mii);
        localStorage.setItem('miis', JSON.stringify(updated));

    }

    static removeMii(id) {
        const miis = Store.getMiis().filter(mii => mii.id !== id);
       
        localStorage.setItem('miis', JSON.stringify(miis));
    }
}




// Dom elements (grab once to use in multiple events)
const slider = document.querySelector('#exp');
const sliderValue = document.querySelector('#slider-value');
const statusSelect = document.querySelector('#mii-status');
const editModalElement = document.querySelector('#editModal');
const editModal = new bootstrap.Modal(editModalElement);
const editSlider = document.querySelector('#edit-exp');
const editSliderValue = document.querySelector('#edit-slider-value');
const editStatusSelect = document.querySelector('#edit-status');

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

// Event update editSlider progress and Status select
editSlider.addEventListener('input', (e) => {
    editSliderValue.textContent = e.target.value;
    editSlider.style.setProperty('--range-progress', `${e.target.value}%`);
});

editStatusSelect.addEventListener('change', (e) => {
    editSlider.classList.remove('range-happy', 'range-sad');
    editSlider.classList.add(e.target.value === 'happy' ? 'range-happy' : 'range-sad');
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
        UI.showAlert('Please fill in Name and Level', 'danger');
    } else {
        // Instatiate mii
    const mii = new Mii(name, level, status, exp, dislike);

    // Add mii to UI and to Storage
    Store.addMii(mii);
    // UI.addMiiToList(mii);
    UI.displayedMiis();

    // Show success add mii message
    UI.showAlert('Mii Added', 'success');

    // Clear fields 
    UI.clearFields();

    // Reset the slider background color classes back to happy green
    slider.classList.remove('range-sad');
    slider.classList.add('range-happy');
    } 
});


// Event: Remove a Mii and Edit a Mii in UI
let currentEditIndex = null;


document.querySelector('#mii-list').addEventListener('click', (e) => {
    // Prevent standard link jump anchor behavior
    if(e.target.classList.contains('edit')) {
        e.preventDefault();
        const row = e.target.closest('tr');
        const id = row.dataset.id;
        currentEditIndex = id;
        const miis = Store.getMiis();
        const mii = miis.find(m => m.id === id);

        document.querySelector('#edit-name').value = mii.name;
        document.querySelector('#edit-level').value = mii.level;
        document.querySelector('#edit-status').value = mii.status;
        document.querySelector('#edit-exp').value = mii.exp;
        document.querySelector('#edit-slider-value').textContent = mii.exp;
        document.querySelector('#edit-dislike').value = mii.dislike;

        const editSlider = document.querySelector('#edit-exp');
        editSlider.classList.remove('range-happy', 'range-sad');
        editSlider.classList.add(mii.status === 'happy' ? 'range-happy' : 'range-sad');
        editSlider.style.setProperty('--range-progress', `${mii.exp}%`);
       
        // const editModal = new bootstrap.Modal(document.querySelector('#editModal'));
        editModal.show();
        return; // stop don't fall into delete logic
    }
    // Remove mii from storage
    if (e.target.classList.contains('delete')) {
            e.preventDefault();
            const row = e.target.closest('tr');
            const id = row.dataset.id;
            Store.removeMii(id);
            // UI.deleteMii(e.target);
            UI.displayedMiis();
            // Show success remove mii message
            UI.showAlert('Mii Removed', 'success');

    }

});



document.querySelector('#save-edit-btn').addEventListener('click', () => {
    const miis = Store.getMiis();
    const mii = miis.find(m => m.id === currentEditIndex);
    mii.name = document.querySelector('#edit-name').value.trim();
    mii.level = document.querySelector('#edit-level').value.trim();
    mii.status = document.querySelector('#edit-status').value;
    mii.exp = document.querySelector('#edit-exp').value;
    mii.dislike = document.querySelector('#edit-dislike').value.trim();
    localStorage.setItem('miis', JSON.stringify(miis))
    UI.displayedMiis(); // re-render whole table with updated data

    // Show success add mii message
    UI.showAlert('Mii Edit Successful', 'success');

    editModal.hide();
});

// Event: Sort Mii