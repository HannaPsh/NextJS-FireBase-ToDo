import { useEffect, useState } from 'react';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { firestore } from '../firebase/clientApp';
import {updateDoc} from "@firebase/firestore";
import { doc } from '@firebase/firestore'; // for creating a pointer to our Document  
import {deleteDoc} from "@firebase/firestore";
import {collection,QueryDocumentSnapshot,DocumentData,query,where,limit,getDocs} from "@firebase/firestore";

const inter = Inter({ subsets: ['latin'] })

const Home: NextPage = () => {
const todosCollection = collection(firestore,'todos');
const [todos,setTodos] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
const [dones,setDones] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
const [loading,setLoading] = useState<boolean>(true);
const getTodos = async () => {
  const todosQuery = query(todosCollection,where('done','==',false),limit(10));

  const querySnapshot = await getDocs(todosQuery);

  const result: QueryDocumentSnapshot<DocumentData>[] = [];
  querySnapshot.forEach((snapshot) => {
  result.push(snapshot);
  });
  setTodos(result);
};
const getDones = async () => {
  const todosQuery = query(todosCollection,where('done','==',true),limit(10));

  const querySnapshot = await getDocs(todosQuery);
 
  const result: QueryDocumentSnapshot<DocumentData>[] = [];
  querySnapshot.forEach((snapshot) => {
  result.push(snapshot);
  });
  setDones(result);
};
const updateTodo = async (documentId: string) => {   
  // create a pointer to the Document id
  const _todo = doc(firestore,`todos/${documentId}`);
  await updateDoc(_todo,{
    "done":true
  });
  getTodos();
}

const deleteTodo = async (documentId:string) => {

  const _todo = doc(firestore,`todos/${documentId}`);

  await deleteDoc(_todo);
 
  getTodos();
}

useEffect( () => {

  getTodos();
  getDones()

  setTimeout( () => {
    setLoading(false);
  },2000)
},[todos,dones]);
return (
   <div className={styles.container}>
   <Head>
     <title>Todos app</title>
     <meta name="description" content="Next.js firebase todos app" />
     <link rel="icon" href="/favicon.ico" />
   </Head>
   <main className={styles.main}>
     <h1 className={styles.title}>
     Todos app
     </h1>
     <p>Consider adding a todo from <a id='addNewLink' href="/add-todo">here</a></p>
     <div className={styles.grid}>
     {loading ? (
    <div className={styles.card}>
      <h2>Loading</h2>
    </div>
  ) : todos.length === 0 ? (
    <div className={styles.card}>
      <h2>No undone todos</h2>
    </div>
  ) : (
    <>
      <div className={styles.todos}>
        <h2>Undone Todos</h2>
        {todos.map((todo) => {
          const data = todo.data();
          return (
            <div className={styles.card}>
              <h2>{data.title}</h2>
              <p>{data.description}</p>
              <div className={styles.cardActions}>
                <button type="button" onClick={() => updateTodo(todo.id)}>Mark as done</button>
                <button type="button" onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.todos}>
        <h2>Done Todos</h2>
        {dones.map((done) => {
          const data = done.data();
          return (
            <div className={styles.card}>
              <h2>{data.title}</h2>
              <p>{data.description}</p>
              <div className={styles.cardActions}>
            <span>Done!</span>
                <button type="button" onClick={() => deleteTodo(done.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  )}
</div> 
   </main>
   <footer className={styles.footer}>
     <a
     href="#"
     rel="noopener noreferrer"
     >
     Todos app
     </a>
   </footer>
   </div>
)
}
export default Home