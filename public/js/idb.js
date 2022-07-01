// variable that will hold the connection:
let db;

// connect to the database:
const request = indexedDB.open('budget', 1);

// add event listenter:
request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true });  // store data to table new_budget
};

// if new_budget db or connection established (navigator.onLine), db referenced saved as global variable
request.onsuccess = function(e) {
    db = e.target.result;

        if (navigator.onLine) {
        //uploadBudget();  
    }
};

// generate error code if not successful
request.onerror = function(e) {
    console.log(e.target.errorCode);
};

// if not connected to internet
function saveRecord(record) {
    const transaction = db.transaction(['new_budget'], 'readwrite'); 

    const budgetObjectStore = transaction.objectStore('new_budget');

    budgetObjectStore.add(record);
}