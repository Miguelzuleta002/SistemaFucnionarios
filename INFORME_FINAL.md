# Informe Técnico: Sistema de Gestión de Funcionarios

## 1. Introducción y Objetivo
El presente documento detalla el diseño, la arquitectura y el proceso de implementación de la aplicación web desarrollada para modernizar el registro y control de la información de funcionarios de una entidad. 

El objetivo principal fue construir una solución robusta (API REST en el Backend y Single Page Application en el Frontend) implementando buenas prácticas de programación orientada a objetos mediante el **Patrón DAO**, manejo centralizado de **excepciones**, y un sistema de **Autenticación y Autorización utilizando JSON Web Tokens (JWT)**.

---

## 2. Tecnologías Utilizadas

La aplicación se construyó bajo una arquitectura Cliente-Servidor (Full-Stack), utilizando las siguientes tecnologías:

### Backend (Capa de Lógica y Datos)
*   **Node.js & Express.js:** Entorno de ejecución y framework para enrutamiento rápido de la API.
*   **MySQL & mysql2:** Motor de base de datos relacional y driver asíncrono (Promesas) para Node.
*   **JWT (jsonwebtoken):** Estándar para la transmisión segura de información entre partes como un objeto JSON, utilizado para mantener la sesión.
*   **Bcryptjs:** Librería para el hashing (encriptación) de contraseñas garantizando que no se guarden en texto plano.
*   **Patrón Arquitectónico DAO (Data Access Object):** Implementado para abstraer y encapsular todos los accesos a la base de datos.

### Frontend (Capa de Presentación)
*   **React + Vite:** Librería principal de interfaces junto con su empaquetador ultrarrápido para un entorno de desarrollo óptimo.
*   **React Router DOM:** Manejo de navegación interna sin recargas de página (SPA).
*   **Axios:** Cliente HTTP configurado con interceptores para enviar automáticamente el token de autorización al backend.
*   **CSS Vanilla Moderno:** Estilos orientados a componentes, utilizando *Glassmorphism*, gradientes, y *Dark Mode* para cumplir con el estándar de una estética premium.

---

## 3. ¿Cómo lo hicimos? (Fases del Desarrollo)

El desarrollo se estructuró de manera progresiva y modular:

### Fase 1: Diseño del Modelo Relacional
Se construyeron scripts SQL completos (`schema.sql` y `seeds.sql`). La base de datos centraliza toda la información, definiendo tablas primarias y catálogos:
*   `roles` y `usuarios` (Con claves foráneas restrictivas).
*   `funcionarios` (Entidad principal).
*   `inventarios`, `marcas`, `estados_equipos`, y `tipos_equipos` (Para cubrir los requerimientos de restricción y permisos).

### Fase 2: Configuración Base y Patrón DAO
Se configuró el entorno del API conectándolo a MySQL mediante un `Pool` de conexiones. Se estructuró el proyecto en carpetas especializadas (`routes`, `controllers`, `dao`, `middlewares`). Cada entidad tiene su clase `DAO` (ej: `FuncionarioDAO`) en la cual **se aislaron al 100% las consultas SQL** (SELECT, INSERT, UPDATE, DELETE), dejando a los Controladores la única tarea de orquestar flujos HTTP.

### Fase 3: Seguridad y Autorización (JWT)
Se creó el `AuthController` junto con el `authMiddleware.js`.
*   **Autenticación:** Al iniciar sesión con credenciales correctas, el backend cifra los datos básicos (ID y Rol) en un JWT.
*   **Autorización:** Se crearon dos roles (`Administrador` y `Docente`). Se diseñó una fábrica de middlewares (`checkRole(['RolPermitido'])`) que intercepta la petición y rechaza con estado HTTP 403 a quienes intenten consumir rutas para las que no tienen permisos.

### Fase 4: Manejo de Excepciones
Para evitar caídas abruptas del servidor por fallos de red o errores de llave duplicada (`ER_DUP_ENTRY` de MySQL al ingresar documentos repetidos), se encapsuló todo en bloques `try/catch`. Los errores son propagados con la función `next(error)` hacia un **ErrorHandler Global** que responde siempre en formato JSON amigable (`{ error: true, message: 'Razón' }`).

### Fase 5 y 6: Interfaz Premium e Integración
En lugar de depender de plantillas básicas, se construyó una interfaz interactiva de modo oscuro.
Se configuraron **Rutas Protegidas en React**. La interfaz lee dinámicamente el `Rol` guardado en LocalStorage y renderiza la UI:
*   Si entra un Administrador, observa ambos módulos y tiene botones de manipulación (Crear, Editar, Eliminar).
*   Si entra un Docente, el Frontend oculta de raíz el módulo de Funcionarios y bloquea cualquier acción de escritura en el módulo de Inventarios.

---

## 4. Conclusión

El desarrollo de este sistema evidencia la importancia de separar las responsabilidades a través de patrones de diseño como el DAO, lo cual facilita enormemente la mantenibilidad y la lectura del código, permitiendo cambiar o escalar el motor de base de datos sin afectar el núcleo de la aplicación (los controladores).

Además, se ha solucionado el problema inicial planteado en el caso de estudio de manera holística:
1.  **Centralización y Organización:** Toda la data ahora reside en una estructura relacional normatizada y escalable.
2.  **Robustez (Prevención de Errores):** El estricto control de excepciones evita rupturas de aplicación y le da guía clara al usuario en caso de datos duplicados.
3.  **Seguridad Sólida:** La implementación de JWT y la separación por roles tanto en el servidor (API Middleware) como en la interfaz de usuario (React Router) garantizan que la información sensible de funcionarios o de configuración de equipos sólo pueda ser alterada por el personal autorizado.

El resultado es un producto final seguro, mantenible y con una excelente experiencia de usuario (UI/UX).
