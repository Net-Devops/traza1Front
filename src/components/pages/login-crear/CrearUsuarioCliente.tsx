import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as CryptoJS from "crypto-js";
import "./crearUsuario.css";
import { Rol } from "../../../types/usuario/Usuario";

const RegistroCliente = () => {
  const [usuario, setUsuario] = useState({
    username: "",
    password: "",
    rol: Rol.DEFAULT,
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    imagen: "",
  });
  const [roles] = useState(Object.keys(Rol));
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const encryptedPassword = CryptoJS.SHA256(usuario.password).toString();

    const response = await fetch(
      "http://localhost:8080/api/usuario/registro/usuario-cliente",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usuario.username,
          password: encryptedPassword,
          rol: usuario.rol,
          cliente: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            telefono: usuario.telefono,
            email: usuario.email,
            fechaNacimiento: usuario.fechaNacimiento,
            imagen: usuario.imagen,
          },
        }),
      }
    );

    if (response.ok) {
      navigate("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      {/* Campos de usuario */}
      <label>
        Nombre de usuario:
        <input type="text" name="username" onChange={handleChange} />
      </label>
      <label>
        Contraseña:
        <input type="password" name="password" onChange={handleChange} />
      </label>
      <label>
        Rol:
        <select name="rol" onChange={handleChange} value={usuario.rol}>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>

      {/* Campos de cliente */}
      <label>
        Nombre:
        <input type="text" name="nombre" onChange={handleChange} />
      </label>
      <label>
        Apellido:
        <input type="text" name="apellido" onChange={handleChange} />
      </label>
      <label>
        Teléfono:
        <input type="text" name="telefono" onChange={handleChange} />
      </label>
      <label>
        Email:
        <input type="email" name="email" onChange={handleChange} />
      </label>
      <label>
        Fecha de Nacimiento:
        <input type="date" name="fechaNacimiento" onChange={handleChange} />
      </label>
      <label>
        Imagen:
        <input type="text" name="imagen" onChange={handleChange} />
      </label>

      <input type="submit" value="Registrar" />
    </form>
  );
};

export default RegistroCliente;
