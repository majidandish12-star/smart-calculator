class AutoTrainer {
  constructor(dbName = 'HyperCalcDB', storeName='AutoTrainer') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
    this.initDB();
  }

  // 🔹 Init IndexedDB
  initDB() {
    const request = indexedDB.open(this.dbName, 1);
    request.onupgradeneeded = e => {
      const db = e.target.result;
      if(!db.objectStoreNames.contains(this.storeName))
        db.createObjectStore(this.storeName, { keyPath:'id', autoIncrement:true });
    };
    request.onsuccess = e => {
      this.db = e.target.result;
      console.log('[AutoTrainer] IndexedDB آماده');
    };
    request.onerror = e => console.error('[AutoTrainer] خطا در ایجاد DB', e);
  }

  // 🔹 Record a calculation
  record(input, output, meta={}) {
    if(!this.db) return;
    const tx = this.db.transaction(this.storeName,'readwrite');
    const store = tx.objectStore(this.storeName);
    store.add({ input, output, meta, timestamp:Date.now() });
  }

  // 🔹 Suggest based on stored data
  suggest(input) {
    if(!this.db) return [];
    return new Promise(resolve => {
      const tx = this.db.transaction(this.storeName,'readonly');
      const store = tx.objectStore(this.storeName);
      const suggestions = [];
      store.openCursor().onsuccess = e => {
        const cursor = e.target.result;
        if(cursor){
          if(cursor.value.input === input) suggestions.push(cursor.value.output);
          cursor.continue();
        } else {
          resolve(suggestions.length ? suggestions : ['💡 AutoTrainer: پیشنهاد جدید']);
        }
      };
    });
  }
}

window.AutoTrainer = new AutoTrainer();

// ======================
// SW Message Listener (Sync)
// ======================
navigator.serviceWorker?.addEventListener('message', e=>{
  if(e.data?.type==='SYNC_AUTOTRAINER'){
    console.log('🔄 SW درخواست ذخیره سازی AutoTrainer آفلاین دارد');
    // می‌تونیم داده‌های موقت را به IndexedDB منتقل کنیم
  }
});
