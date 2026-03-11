import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import styles from "./Login.module.css";


export default function Login() {
    const navigate = useNavigate();

    const [mode, setMode] = useState("login"); // "login" | "register"
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function resetMessages() {
        setError("");
        setSuccess("");
    }

    function switchMode(nextMode) {
        resetMessages();
        setMode(nextMode);
    }

    async function handleSubmit(e) {
       /* e.preventDefault();
        resetMessages();

        const u = username.trim();
        if (!u || !password) {
            setError("Completa usuario y contraseña.");
            return;
        }

        if (mode === "register" && password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            if (mode === "register") {
                await axios.post(
                    `${apiBaseUrl}/user/register`,
                    { username: u, password },
                    { headers: { "Content-Type": "application/json" } }
                );
                setSuccess("Usuario registrado. Ahora inicia sesión.");
                setMode("login");
                setConfirmPassword("");
                return;
            }

            // OAuth2PasswordRequestForm -> x-www-form-urlencoded
            const body = new URLSearchParams();
            body.set("username", u);
            body.set("password", password);

            const res = await axios.post(`${apiBaseUrl}/user/login`, body, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const token = res?.data?.access_token;
            if (token) localStorage.setItem("access_token", token);
            if (res?.data?.user_id != null) localStorage.setItem("user_id", String(res.data.user_id));
            localStorage.setItem("token_type", res?.data?.token_type || "bearer");

            setSuccess("¡Listo! Entrando al juego…");
            navigate("/home");
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message ||
                "Error desconocido";
            setError(String(msg));
        } finally {
            setLoading(false);
        }
 */   }

    return (
        <main className={styles.screen}>

            <section className={styles.panel} aria-label="Acceso de usuario">
                <div className={styles.topRow}>
                    <Link className={styles.back} to={"/"} title="Volver al menú">
                        X
                    </Link>

                </div>

                <div className={styles.switchRow} role="tablist" aria-label="Modo de acceso">
                    <button
                        type="button"
                        className={`${styles.switchBtn} ${mode === "login" ? styles.active : ""}`}
                        onClick={() => switchMode("login")}
                        role="tab"
                        aria-selected={mode === "login"}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        type="button"
                        className={`${styles.switchBtn} ${mode === "register" ? styles.active : ""}`}
                        onClick={() => switchMode("register")}
                        role="tab"
                        aria-selected={mode === "register"}
                    >
                        Registrarse
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        Email
                        <input
                            className={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            disabled={loading}
                        />
                    </label>

                    {mode === "register" ? (
                        <label className={styles.label}>
                            Nombre de usuario
                            <input
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                disabled={loading}
                            />
                        </label>
                    ) : null}

                    <label className={styles.label}>
                        Contraseña
                        <input
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                            disabled={loading}
                        />
                    </label>

                    {mode === "register" ? (
                        <label className={styles.label}>
                            Repite contraseña
                            <input
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                autoComplete="new-password"
                                disabled={loading}
                            />
                        </label>
                    ) : null}

                    {error ? <p className={styles.error}>{error}</p> : null}
                    {success ? <p className={styles.success}>{success}</p> : null}

                    <div className={styles.actions}>
                        <button className={styles.primary} type="submit" disabled={loading}>
                            {loading ? "Cargando…" : mode === "login" ? "Entrar" : "Crear cuenta"}
                        </button>
                    </div>


                </form>
            </section>
        </main>
    );
}