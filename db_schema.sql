-- Script para crear la base de datos del Consultorio Taita Jajoy
-- Ejecuta esto en tu servidor PostgreSQL

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- paciente, médico, admin
    teléfono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATE,
    dirección VARCHAR(200),
    género VARCHAR(20),
    estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripción TEXT,
    precio NUMERIC(10,2) NOT NULL,
    categoría VARCHAR(50),
    imagen_url VARCHAR(200),
    estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE inventario (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL,
    fecha_actualización TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ubicación VARCHAR(100)
);

CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, confirmada, cancelada, completada
    motivo VARCHAR(200),
    notas TEXT,
    médico_id INTEGER REFERENCES usuarios(id)
);

CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    cita_id INTEGER REFERENCES citas(id) ON DELETE CASCADE,
    diagnóstico TEXT,
    tratamiento TEXT,
    notas TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    médico_id INTEGER REFERENCES usuarios(id)
);

-- Fin del script
