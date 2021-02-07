let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Error" + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.createObjectStore("pending");

  store.add(record);
}

function checkDatabase() {
  if (getAll.result.length > 0) {
    fetch("/api/transaction/bulk", {
      method: "POST",
      body: JSON.stringify(getAll.result),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Contnet-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.createObjectStore("pending");
        store.clear();
      });
  }
}
function deletePending() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.createObjectStore("pending");
  store.clear();
}

window.addEventListener("online", checkDatabase);
