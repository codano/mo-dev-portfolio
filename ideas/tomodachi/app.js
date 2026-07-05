// Mii Class: Represents a Mii
class Mii{
    constructor (name, level, exp, dislike) {
        this.name = name;
        this.level = level;
        this.exp = exp;
        this.dislike = dislike;
    }
}

// Ui Class: Handle UI Tasks
class UI {
    static displayedMiis() {
        const StoredMiis = [
            {
                name: '1',
                level: '3',
                exp: 'above',
                dislike: 'cheese'
            },
             {
                name: 'allen',
                level: '2',
                exp: 'below',
                dislike: 'peppers'
            },
             {
                name: 'vegeta',
                level: '9',
                exp: 'above',
                dislike: 'cake'
            }
        ];

        const Mii = StoredMiis;

        Mii.forEach((mii) => UI.addMiiToList(mii));
    }

    static addMiiToList(mii) {
        const list = document.querySelector('#mii-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${mii.name}</td>
        <td>${mii.level}</td>
        <td>${mii.exp}</td>
        <td>${mii.dislike}</td>
        <td><a href= "#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }
}

// Store Class: Handles Storage

// Event: Display Mii (Show mii in list)
document.addEventListener('DOMContentLoaded', UI.displayedMiis);

// Event: Add a Mii
document.querySelector('#mii-form').addEventListener('submit');
// Event: Edit a Mii

// Event: Remove a Mii

// Event: Sort Mii