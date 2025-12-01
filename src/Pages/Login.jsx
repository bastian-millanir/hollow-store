import { useState } from "react";
import { useAuth } from "../Context/Authcontext";

export default function Login() {
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validaciones
  const validate = () => {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Formato de correo inválido.";
    }

    if (!form.password.trim()) {
      errors.password = "La contraseña es obligatoria.";
    } else if (form.password.length < 4) {
      errors.password = "Debe tener al menos 4 caracteres.";
    }

    return errors;
  };

  const errors = validate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setServerError("");

    try {
      //  Llamamos al AuthContext, este ya guardará token y user
      await login(form.email, form.password, form.remember);
    } catch (err) {
      setServerError(err.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field) =>
    submitted || touched[field]
      ? errors[field]
        ? "border-red-500"
        : "border-purple-500"
      : "border-gray-600";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#111] shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-800">

        <h2 className="text-3xl font-bold text-center text-purple-400 mb-8">
          Iniciar Sesión
        </h2>

        {serverError && (
          <div className="bg-red-900/40 text-red-400 border border-red-700 p-3 mb-4 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className={`p-3 rounded-lg bg-black border ${fieldClass(
                "email"
              )} text-white placeholder-gray-500 focus:outline-none`}
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {(touched.email || submitted) && errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              className={`p-3 rounded-lg bg-black border ${fieldClass(
                "password"
              )} text-white placeholder-gray-500 focus:outline-none`}
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {(touched.password || submitted) && errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password}
              </span>
            )}
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="accent-purple-600"
            />
            Recordarme
          </label>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-semibold text-white shadow-lg"
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
