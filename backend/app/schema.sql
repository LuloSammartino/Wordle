-- Esquema de base de datos para Wordle con Oracle Cloud
-- Ejecutar este script en Oracle Cloud Database

-- Tabla de usuarios
CREATE TABLE usuarios (
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de progreso diario (letras completadas por día)
CREATE TABLE progreso_diario (
    progreso_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    fecha DATE NOT NULL,
    palabra_completada VARCHAR2(50),
    intentos NUMBER DEFAULT 0,
    score NUMBER DEFAULT 0,
    letras_completadas CLOB, -- JSON string con las letras y su estado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progreso_usuario FOREIGN KEY (user_id) REFERENCES usuarios(user_id) ON DELETE CASCADE,
    CONSTRAINT uk_progreso_usuario_fecha UNIQUE (user_id, fecha)
);

-- Tabla de estadísticas de letras por usuario
CREATE TABLE estadisticas_letras (
    estadistica_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    letra VARCHAR2(1) NOT NULL,
    estado NUMBER NOT NULL, -- 0: incorrecta, 1: en palabra pero lugar incorrecto, 2: correcta
    fecha DATE NOT NULL,
    palabra_id NUMBER, -- Referencia a progreso_diario si es necesario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_estadistica_usuario FOREIGN KEY (user_id) REFERENCES usuarios(user_id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_progreso_usuario_fecha ON progreso_diario(user_id, fecha);
CREATE INDEX idx_estadisticas_usuario_fecha ON estadisticas_letras(user_id, fecha);
CREATE INDEX idx_estadisticas_letra ON estadisticas_letras(letra);

-- Trigger para actualizar updated_at en usuarios
CREATE OR REPLACE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Vista para estadísticas de usuarios
CREATE OR REPLACE VIEW vw_estadisticas_usuarios AS
SELECT 
    u.user_id,
    u.username,
    COUNT(DISTINCT pd.fecha) as dias_jugados,
    SUM(pd.score) as score_total,
    AVG(pd.intentos) as promedio_intentos,
    COUNT(pd.palabra_completada) as palabras_completadas
FROM usuarios u
LEFT JOIN progreso_diario pd ON u.user_id = pd.user_id
GROUP BY u.user_id, u.username;


