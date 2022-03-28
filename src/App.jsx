import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import React, {useEffect, useState} from "react";
import { firestore } from "./firebaseconfig";


function App() {
  const[idUsuario, setId] = useState('');
  const[nombre, setNombre] = useState('');
  const[phone, setPhone] = useState('');
  const[error, setError] = useState('');
  const[usuario, setUsuario] = useState([]);
  const[modoEdicion, setModoEdicion] =useState(null)

  const setUsuarios = async (e) =>{
    e.preventDefault();

    if(!nombre.trim()){
      setError('El campo nombre está vacio');
      return;
    }else if(!phone.trim()){
      setError('El campo teléfono está vacio');
      return;
    }

    const usuario = {
      nombre: nombre,
      telefono: phone
    }

    try {
      const data = await addDoc(collection(firestore,'agenda'),usuario);
      alert('Usuario añadido');
      const {docs} = await getDocs(collection(firestore,'agenda'));
      const newArray = docs.map( (doc) => ({
        id: doc.id, ...doc.data()
      }));
      setUsuario(newArray);
    } catch (e) {
      console.log(e);
    }

    setNombre('');
    setPhone('');
  }

  const getUsuarios = async () => {
    const {docs} = await getDocs(collection(firestore,'agenda'));
    const newArray = docs.map( (doc) => ({
      id: doc.id, ...doc.data()
    }));
    setUsuario(newArray);
  }

  const borrarUsuario = async (id) => {
    try {
      await deleteDoc(doc(firestore,'agenda',id));

      const {docs} = await getDocs(collection(firestore,'agenda'));
      const newArray = docs.map( (doc) => ({
        id: doc.id, ...doc.data()
      }));
      setUsuario(newArray);
    } catch (e) {
      console.log(e);
    }
  }

  const pulsarActualizar = async (id) => {
    try {
      const dato = await getDoc(doc(firestore,'agenda',id));

      const { nombre,telefono } = dato.data();

      setNombre(nombre);
      setPhone(telefono);
      setId(id);
      setModoEdicion(true);
    } catch (e) {
      console.log(e);
    }
  }

  const setUpdate = async (e) => {
    e.preventDefault();

    if(!nombre.trim()){
      setError('El campo nombre está vacio');
      return;
    }else if(!phone.trim()){
      setError('El campo teléfono está vacio');
      return;
    }

    const nuevoUsuario = {
      nombre: nombre,
      telefono: phone
    }

    try {
      await setDoc(doc(firestore,'agenda',idUsuario),nuevoUsuario);
      const {docs} = await getDocs(collection(firestore,'agenda'));
      const newArray = docs.map( (doc) => ({
        id: doc.id, ...doc.data()
      }));
      setUsuario(newArray);
    } catch (e) {
      console.log(e)
    }
    setModoEdicion(false);
    setNombre('');
    setPhone('');
  }

  useEffect( ()=>{
    getUsuarios();
  },[])

  return (
    <div className="container">
      <div className="row">

        <div className="col">
          <h2>Formulario Usuario</h2>
          <form onSubmit={modoEdicion ? setUpdate : setUsuarios} className="form-group">
            <input
              value={nombre}
              onChange={(e)=>{ setNombre(e.target.value) }}
              className="form-control"
              placeholder="introduce el nombre"
              type='text'
            />
            <input
              value={phone}
              onChange={(e)=>{ setPhone(e.target.value) }}
              className="form-control mt-3"
              placeholder="introduce el número"
              type='text'
            />
            {
              modoEdicion ?
              (
                <input
                  className="btn btn-success btn-block mt-3"
                  type="submit"
                  value='Guardar'
                />
              )
              :
              (
                <input
                  className="btn btn-dark btn-block mt-3"
                  type="submit"
                  value='Registrar'
                />
              )
            }
          </form>
          {
            error ? 
            (
              <div>
                <p>{error}</p>
              </div>
            )
            :
            (
              <span></span>
            )
          }
        </div>

        <div className="col">
          <h2>Lista de tu Agenda</h2>

          <ul className="list-group">
          {
            usuario.length !== 0 ?
            (
              usuario.map( item => (
                <li className="list-group-item" key={item.id}>{item.nombre} -- {item.telefono}
                  <button onClick={(id) => {borrarUsuario(item.id)}} className="btn btn-danger float-right">Borrar</button>
                  <button onClick={(id) => {pulsarActualizar(item.id)}} className="btn btn-info mr-3 float-right">Actualizar</button>
                </li>
              ))
            )
            :
            (
              <span>
                No hay usuarios en tu agenda
              </span>
            )
          }
          </ul>

        </div>

      </div>
    </div>
  );
}

export default App;
