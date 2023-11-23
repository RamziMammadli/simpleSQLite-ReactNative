// Home.tsx

import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import db from './database'; //databazani import elediy kele

interface Product {
  id: number;
  name: string;
}

const Home = () => {

  const [data, setData] = useState<Product[]>([]);

  const fetchToSqlite = () => {
    axios.get('https://northwind.vercel.app/api/products').then((res) => {
      const apiData: Product[] = res.data;

      // tulladiq sqlite 
      db.transaction((tx: any) => {
        apiData.forEach((item) => {
          tx.executeSql('INSERT INTO products (name) VALUES (?)', [item.name]);
        });
      });
    });
  }

  const removeSqlite = async () => {
    await new Promise<void>((resolve) => {
      db.transaction((tx: any) => {
        tx.executeSql('DELETE FROM products', [], () => {
          resolve();
        });
      });
    });
  }

  useEffect(() => {
    // sqlitedan cekek
    db.transaction((tx: any) => {
      tx.executeSql('SELECT * FROM products', [], (tx: any, results: any) => {
        const rows = results.rows;

        let products: Product[] = [];

        for (let i = 0; i < rows.length; i++) {
          products.push({
            id: rows.item(i).id,
            name: rows.item(i).name,
          });
        }

        // sqlitedakilari tulla stateye
        setData(products);
      });
    });
  }, [fetchToSqlite]);


  const renderItem = ({ item }: { item: Product }) => {
    return (
    <Text>{item.name}</Text>
    )
  };


  return (
    <View>
      <TouchableOpacity style={{backgroundColor:'blue', margin:15, height:50, justifyContent:'center', alignItems:'center'}} onPress={() => fetchToSqlite()}>
        <Text style={{color:'white'}}>
          Datalari cek
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor:'blue', margin:15, height:50, justifyContent:'center', alignItems:'center'}} onPress={() => removeSqlite()}>
        <Text style={{color:'white'}}>
          Datalari sil
        </Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
