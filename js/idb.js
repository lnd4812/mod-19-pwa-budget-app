// variable that will hold the connection:
let db;

// connect to the database:
const request = indexedDB.open('transaction', 1);

// add event listenter:
request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });  // store data to table new_transaction
};

// if new_transaction db or connection established (navigator.onLine), db referenced saved as global variable
request.onsuccess = function(e) {
    db = e.target.result;

        if (navigator.onLine) {
            uploadTransaction();
        }    
};            

// generate error code if not successful
request.onerror = function(e) {
    console.log(e.target.errorCode);
};

// if not connected to internet
function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite'); 

    const transactionObjectStore = transaction.objectStore('new_transaction');

    transactionObjectStore.add(record);
};

// retrieve data saved when offline
function uploadTransaction () {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('new_transaction');
    const getAll = transactionObjectStore.getAll();
       
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST', 
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                   "Content-Type": "application/json"
                }
                })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(["new_transaction"], "readwrite");
                const transactionObjectStore = transaction.objectStore("new_transaction");
                transactionObjectStore.clear();
            })
            .catch(err => {
            console.log(err);
            });
        }
    };
};
// to initiate function that will upload saved data once server comes back online
window.addEventListener('online', uploadTransaction);

