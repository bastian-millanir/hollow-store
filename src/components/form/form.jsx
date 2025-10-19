// src/components/form/form.jsx
import { useState } from "react";
import './form.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function Form() {
  const regionOptions = [
      "Selecciona una región",
      "Región de Arica y Parinacota",
      "Región de Tarapacá",
      "Región de Antofagasta",
      "Región de Atacama",
      "Región de Coquimbo",
      "Región de Valparaíso",
      "Región Metropolitana de Santiago",
      "Región de O'Higgins",
      "Región del Maule",
      "Región del Ñuble",
      "Región del Biobío",
      "Región de La Araucanía",
      "Región de Los Ríos",
      "Región de Los Lagos",
      "Región de Aysén",
      "Región de Magallanes y la Antártica Chilena",
  ];

  const [values, setValues] = useState({
      nombre: "",
      apellido: "",
      email: "",
      direccion: "",
      region: "",
      comuna: "",
      mensaje: "",
  });

  const [touched, setTouched] = useState({
      nombre: false,
      apellido: false,
      email: false,
      direccion: false,
      region: false,
      comuna: false,
      mensaje: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const errors = {
      nombre: values.nombre.trim() === "" ? "El nombre es obligatorio" : "",
      apellido: values.apellido.trim() === "" ? "El apellido es obligatorio" : "",
      email:
          values.email.trim() === ""
              ? "El mail es obligatorio"
              : EMAIL_RE.test(values.email)
                  ? ""
                  : "El mail no tiene formato válido",
      direccion: values.direccion.trim() === "" ? "La dirección es obligatoria" : "",
      region: values.region === "" || values.region === "Selecciona una región" ? "Debe seleccionar una región" : "",
      comuna: values.comuna.trim() === "" ? "La comuna es obligatoria" : "",
      mensaje: values.mensaje.trim() === "" ? "El mensaje es obligatorio" : "",
  };

  const isValid = (FIELD) => !errors[FIELD];

  const fieldClass = (FIELD) => {
      const show = touched[FIELD] || submitted;
      if (!show) return "form-control";
      return isValid(FIELD) ? "form-control is-valid" : "form-control is-invalid";
  };

  const handlerChange = (e) => {
      const {name, value} = e.target;
      setTouched((t) => ({...t, [name]: true}));
      setValues((v) => ({...v, [name]: value}));
  };

  const handleBlur = (e) => {
      const {name} = e.target;
      setTouched((t) => ({...t, [name]: true}));
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      setSubmitted(true);
      const allValid =
          isValid("nombre") &&
          isValid("apellido") &&
          isValid("email") &&
          isValid("direccion") &&
          isValid("region") &&
          isValid("comuna") &&
          isValid("mensaje");

      if (allValid) {
          alert("Formulario enviado correctamente");
          setValues({
              nombre: "",
              apellido: "",
              email: "",
              direccion: "",
              region: "",
              comuna: "",
              mensaje: ""
          });
          setTouched({
              nombre: false,
              apellido: false,
              email: false,
              direccion: false,
              region: false,
              comuna: false,
              mensaje: false
          });
          setSubmitted(false);
      }
  };

  return (
      <section id="contacto" className="section-bg-LIGHT py-5">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-12 col-md-10 col-lg-8">
                      <div id="pre-register-form" className="card mx-auto p-4 rounded-4 shadow-sm"
                           style={{maxWidth: 720}}>
                          <div className="card-body">
                              <h2 id="title-form" className="mb-4 text-center text-white">Contacto</h2>
                              <form onSubmit={handleSubmit} noValidate>
                                  <div className="row g-3">
                                      <div className="col-md-6">
                                          <label htmlFor="nombre"
                                                 className="form-label">Nombre:</label>
                                          <input id="nombre" name="nombre"
                                                 type="text"
                                                 className={fieldClass("nombre")}
                                                 placeholder="Ingrese nombre"
                                                 value={values.nombre}
                                                 onChange={handlerChange}
                                                 onBlur={handleBlur}/>
                                          {(touched.nombre || submitted) && errors.nombre &&
                                              <div
                                                  className="invalid-feedback">{errors.nombre}</div>}
                                          {(touched.nombre || submitted) && !errors.nombre &&
                                              <div
                                                  className="valid-feedback">Correcto</div>}
                                      </div>

                                      <div className="col-md-6">
                                          <label htmlFor="apellido"
                                                 className="form-label">Apellido:</label>
                                          <input id="apellido"
                                                 name="apellido" type="text"
                                                 className={fieldClass("apellido")}
                                                 placeholder="Ingrese apellido"
                                                 value={values.apellido}
                                                 onChange={handlerChange}
                                                 onBlur={handleBlur}/>
                                          {(touched.apellido || submitted) && errors.apellido &&
                                              <div
                                                  className="invalid-feedback">{errors.apellido}</div>}
                                          {(touched.apellido || submitted) && !errors.apellido &&
                                              <div
                                                  className="valid-feedback">Correcto</div>}
                                      </div>

                                      <div className="col-md-6">
                                          <label htmlFor="email"
                                                 className="form-label">Email:</label>
                                          <input id="email" name="email"
                                                 type="email"
                                                 className={fieldClass("email")}
                                                 placeholder="Ingrese email"
                                                 value={values.email}
                                                 onChange={handlerChange}
                                                 onBlur={handleBlur}/>
                                          {(touched.email || submitted) && errors.email &&
                                              <div
                                                  className="invalid-feedback">{errors.email}</div>}
                                          {(touched.email || submitted) && !errors.email &&
                                              <div
                                                  className="valid-feedback">Correcto</div>}
                                      </div>

                                      <div className="col-md-6">
                                          <label htmlFor="direccion"
                                                 className="form-label">Dirección:</label>
                                          <input id="direccion"
                                                 name="direccion"
                                                 type="text"
                                                 className={fieldClass("direccion")}
                                                 placeholder="Ingrese dirección"
                                                 value={values.direccion}
                                                 onChange={handlerChange}
                                                 onBlur={handleBlur}/>
                                          {(touched.direccion || submitted) && errors.direccion &&
                                              <div
                                                  className="invalid-feedback">{errors.direccion}</div>}
                                          {(touched.direccion || submitted) && !errors.direccion &&
                                              <div
                                                  className="valid-feedback">Correcto</div>}
                                      </div>

                                      <div className="col-md-6">
                                          <label htmlFor="region"
                                                 className="form-label">Región:</label>
                                          <select id="region" name="region"
                                                  className={fieldClass("region")}
                                                  value={values.region}
                                                  onChange={handlerChange}
                                                  onBlur={handleBlur}>
                                              {regionOptions.map((r) => (
                                                  <option key={r}
                                                          value={r === "Selecciona una región" ? "" : r}>
                                                      {r}
                                                  </option>
                                              ))}
                                          </select>
                                          {(touched.region || submitted) && errors.region &&
                                              <div
                                                  className="invalid-feedback d-block">{errors.region}</div>}
                                          {(touched.region || submitted) && !errors.region &&
                                              <div
                                                  className="valid-feedback d-block">Correcto</div>}
                                      </div>

                                      <div className="col-md-6">
                                          <label htmlFor="comuna"
                                                 className="form-label">Comuna:</label>
                                          <input id="comuna" name="comuna"
                                                 type="text"
                                                 className={fieldClass("comuna")}
                                                 placeholder="Ingrese comuna"
                                                 value={values.comuna}
                                                 onChange={handlerChange}
                                                 onBlur={handleBlur}/>
                                          {(touched.comuna || submitted) && errors.comuna &&
                                              <div
                                                  className="invalid-feedback">{errors.comuna}</div>}
                                          {(touched.comuna || submitted) && !errors.comuna &&
                                              <div
                                                  className="valid-feedback">Correcto</div>}
                                      </div>

                                      <div className="col-12">
                                          <label htmlFor="mensaje"
                                                 className="form-label">Mensaje:</label>
                                          <textarea id="mensaje"
                                                    name="mensaje" rows="4"
                                                    className={fieldClass("mensaje")}
                                                    placeholder="Ingrese mensaje"
                                                    value={values.mensaje}
                                                    onChange={handlerChange}
                                                    onBlur={handleBlur}/>
                                          {(touched.mensaje || submitted) && errors.mensaje &&
                                              <div
                                                  className="invalid-feedback">{errors.mensaje}</div>}
                                          {(touched.mensaje || submitted) && !errors.mensaje &&
                                              <div
                                                  className="valid-feedback">Correcto</div>}
                                      </div>
                                  </div>

                                  <div
                                      className="d-grid d-sm-flex justify-content-end gap-3 mt-4">
                                      <button id="button-form" type="submit"
                                              className="btn btn-primary btn-lg">Enviar
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
  );
}

export default Form;