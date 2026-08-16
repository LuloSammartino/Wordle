CREATE TABLE usuarios (
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE progreso_diario (
    progreso_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    fecha DATE NOT NULL,
    palabra_completada VARCHAR2(32) NOT NULL,
    intentos NUMBER(2) NOT NULL CHECK (intentos BETWEEN 1 AND 20),
    score NUMBER(10) DEFAULT 0 NOT NULL CHECK (score >= 0),
    letras_completadas CLOB,
    CONSTRAINT fk_progreso_usuario FOREIGN KEY (user_id) REFERENCES usuarios(user_id),
    CONSTRAINT uq_progreso_usuario_fecha UNIQUE (user_id, fecha)
);

CREATE TABLE estadisticas_letras (
    estadistica_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    palabra_id NUMBER NOT NULL,
    letra VARCHAR2(2) NOT NULL,
    estado NUMBER(1) NOT NULL CHECK (estado IN (0, 1, 2)),
    fecha DATE NOT NULL,
    CONSTRAINT fk_estadistica_usuario FOREIGN KEY (user_id) REFERENCES usuarios(user_id),
    CONSTRAINT fk_estadistica_progreso FOREIGN KEY (palabra_id) REFERENCES progreso_diario(progreso_id)
);

CREATE INDEX idx_progreso_usuario ON progreso_diario(user_id, fecha);
CREATE INDEX idx_estadisticas_usuario ON estadisticas_letras(user_id, letra, estado);
