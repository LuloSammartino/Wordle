CREATE TABLE usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE progreso (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    palabra_objetivo VARCHAR(32) NOT NULL,
    idioma VARCHAR(2) NOT NULL DEFAULT 'es',
    estado VARCHAR(12) NOT NULL DEFAULT 'en_curso'
        CHECK (estado IN ('en_curso', 'ganada', 'perdida', 'abandonada')),
    intentos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
        CHECK (cardinality(intentos) <= 5),
    creada_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
