// database.ts

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'mydatabase.db', location: 'default' });

// Tabloyu oluştur
db.transaction((tx: any) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)',
    [],
    () => console.log('Table created successfully'),
    (error: any) => console.log('Error creating table: ', error)
  );
});

export default db;
