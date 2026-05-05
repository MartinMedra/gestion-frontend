# Gestión Frontend 🚀

**Gestión Frontend** es una aplicación de gestión integral construida con **React**, **Vite**, y **Tailwind CSS**. Se conecta con microservicios backend de **PHP/Laravel** para manejar autenticación y gestión de piezas.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación Rápida](#instalación-rápida)
- [Levantar el Proyecto](#levantar-el-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Rutas Disponibles](#rutas-disponibles)
- [Configuración](#configuración)
- [Tecnologías](#tecnologías)
- [Microservicios](#microservicios)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

- ✅ **Autenticación** con JWT integrada
- ✅ **Dashboard** interactivo con gráficos (Recharts)
- ✅ **Gestión de Piezas** con formulario completo
- ✅ **Reportes** con visualización de datos
- ✅ **Rutas Protegidas** con redirección automática
- ✅ **Diseño Responsivo** con Tailwind CSS
- ✅ **Animaciones** con Animate.css

---

## 🏗️ Arquitectura

El proyecto está compuesto por:

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│        Puerto: 5173 (desarrollo)        │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼─────────┐  ┌───▼────────────┐
│  Auth Service   │  │ Pieces Service │
│  (PHP/Laravel)  │  │ (PHP/Laravel)  │
│  Puerto: 8001   │  │  Puerto: 8002  │
└───────┬─────────┘  └───┬────────────┘
        │                 │
┌───────▼─────────┐  ┌───▼────────────┐
│  PostgreSQL     │  │  PostgreSQL    │
│   auth_db       │  │   pieces_db    │
└─────────────────┘  └────────────────┘
```

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Requisito | Versión | Descargar |
|-----------|---------|----------|
| **Node.js** | v22+ | [nodejs.org](https://nodejs.org) |
| **npm** | v10+ | Se instala con Node.js |
| **Docker** | v24+ | [docker.com](https://www.docker.com) |
| **Docker Compose** | v2+ | Se instala con Docker Desktop |
| **Git** | Última versión | [git-scm.com](https://git-scm.com) |

### Verificar Instalación

```bash
# Verifica las versiones instaladas
node --version      # v22.x.x
npm --version       # 10.x.x
docker --version    # Docker version 24.x.x
docker-compose --version  # Docker Compose version 2.x.x
git --version       # git version 2.x.x
```

---

## 🚀 Instalación Rápida

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/MartinMedra/gestion-frontend.git
cd gestion-frontend
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

### 3️⃣ Configurar Variables de Entorno (Opcional)

Si necesitas configurar URLs de API personalizadas, crea un archivo `.env.local` o `.env`:

```bash
# .env.local
VITE_API_AUTH_URL=http://localhost:8001/api
VITE_API_PIECES_URL=http://localhost:8002/api
```

---

## 🏃 Levantar el Proyecto

### Opción A: Desarrollo Local (Recomendado para desarrollo)

#### 1. Levantar los Microservicios con Docker

```bash
# Levanta Auth Service, Pieces Service y sus bases de datos PostgreSQL
docker-compose up -d
```

Espera **2-3 minutos** a que todo esté listo. Puedes verificar el estado:

```bash
docker-compose ps
```

Deberías ver:
- ✅ `postgres_auth` (running)
- ✅ `postgres_pieces` (running)
- ✅ `auth_service` (running) - Puerto 8001
- ✅ `pieces_service` (running) - Puerto 8002

#### 2. Levantar el Frontend

En otra terminal:

```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

### Opción B: Proyecto Completo en Docker (Producción/Demostración)

Para levantar TODO el stack (frontend + microservicios) en Docker:

```bash
# Construye todas las imágenes y levanta los contenedores
docker-compose up --build

# O en segundo plano:
docker-compose up -d --build
```

Luego accede a:
- **Frontend**: http://localhost:5173
- **Auth Service**: http://localhost:8001
- **Pieces Service**: http://localhost:8002

---

### Opción C: Modo Mixto (Frontend local + Servicios en Docker)

Si prefieres desarrollar el frontend localmente pero los servicios en Docker:

```bash
# Terminal 1: Levanta solo los servicios backend
docker-compose up -d auth_service pieces_service postgres_auth postgres_pieces

# Terminal 2: Levanta el frontend
npm run dev
```

---

## 🛑 Detener el Proyecto

### Detener sin eliminar volúmenes (datos se conservan)

```bash
docker-compose stop
```

### Detener y eliminar contenedores (los datos en BD se pierden)

```bash
docker-compose down
```

### Detener y eliminar TODO (contenedores + volúmenes + redes)

```bash
docker-compose down -v
```

---

## 📂 Estructura del Proyecto

```
gestion-frontend/
├── public/                    # Archivos estáticos
├── src/
│   ├── api/                  # Llamadas a APIs
│   │   ├── authApi.js        # API de autenticación
│   │   ├── piezasApi.js      # API de piezas
│   │   └── axios.js          # Instancia configurada de Axios
│   │
│   ├── assets/               # Imágenes, fuentes, etc.
│   │
│   ├── components/           # Componentes reutilizables
│   │   └── ui/               # Componentes de UI
│   │       ├── cotecmarIcon.jsx
│   │       └── index.jsx
│   │
│   ├── context/              # Context API de React
│   │   └── AuthContext.jsx   # Estado global de autenticación
│   │
│   ├── pages/                # Páginas/Vistas
│   │   ├── LoginPage.jsx     # Página de login
│   │   ├── DashboardPage.jsx # Dashboard principal
│   │   ├── FormularioPage.jsx # Formulario de piezas
│   │   └── ReportesPage.jsx  # Página de reportes
│   │
│   ├── router/               # Configuración de rutas
│   │   └── AppRouter.jsx     # Router principal con rutas protegidas
│   │
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Punto de entrada
│   ├── index.css             # Estilos globales
│   └── App.css               # Estilos de App
│
├── docker/                   # Dockerfiles de microservicios
│   ├── auth.Dockerfile       # Construcción de Auth Service
│   └── pieces.Dockerfile     # Construcción de Pieces Service
│
├── .env.local                # Variables de entorno (no incluir en git)
├── docker-compose.yml        # Configuración de servicios Docker
├── Dockerfile                # Dockerfile del frontend
├── vite.config.js            # Configuración de Vite
├── tailwind.config.js        # Configuración de Tailwind CSS
├── postcss.config.js         # Configuración de PostCSS
├── eslint.config.js          # Configuración de ESLint
├── package.json              # Dependencias y scripts
└── README.md                 # Este archivo
```

---

## 🛣️ Rutas Disponibles

| Ruta | Componente | Acceso | Descripción |
|------|-----------|--------|-------------|
| `/` | Redirect | Público | Redirige a `/login` |
| `/login` | LoginPage | Público | Página de inicio de sesión |
| `/dashboard` | DashboardPage | Protegido | Dashboard con gráficos e información |
| `/formulario` | FormularioPage | Protegido | Formulario para crear/editar piezas |
| `/reportes` | ReportesPage | Protegido | Página de reportes y análisis |

**Rutas Protegidas**: Requieren estar autenticado. Si accedes sin token, te redirige a `/login` automáticamente.

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URLs de los APIs
VITE_API_AUTH_URL=http://localhost:8001/api
VITE_API_PIECES_URL=http://localhost:8002/api

# Otras configuraciones opcionales
VITE_APP_TITLE=Gestión Frontend
```

### Configuración de Axios

El cliente HTTP está centralizado en `src/api/axios.js`:

```javascript
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH_URL || 'http://localhost:8001/api',
  timeout: 5000,
})

// Interceptor para agregar token JWT
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
```

### Autenticación (AuthContext)

El contexto de autenticación maneja el estado global del usuario y token:

```javascript
const { estaAutenticado, usuario, cargando, login, logout } = useAuth()
```

---

## 🛠️ Tecnologías

### Frontend
- **React** v19 - Librería UI
- **Vite** v8 - Bundler y dev server ultrarrápido
- **React Router** v7 - Enrutamiento
- **Tailwind CSS** v3 - Utility-first CSS framework
- **Axios** - Cliente HTTP
- **Recharts** v3 - Gráficos interactivos
- **Animate.css** - Animaciones CSS predefinidas

### Backend (Microservicios)
- **PHP** v8.4 - Lenguaje
- **Laravel** - Framework web
- **PostgreSQL** v16 - Base de datos

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación de contenedores
- **Node.js** v22 - Runtime de JavaScript

---

## 🔗 Microservicios

### Auth Service (Puerto 8001)

**Repositorio**: [github.com/MartinMedra/auth-service](https://github.com/MartinMedra/auth-service)

Maneja:
- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ Generación de tokens JWT
- ✅ Validación de credenciales

**Endpoints principales**:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obtener usuario actual

**Base de datos**: PostgreSQL (auth_db)

---

### Pieces Service (Puerto 8002)

**Repositorio**: [github.com/MartinMedra/pieces-service](https://github.com/MartinMedra/pieces-service)

Maneja:
- ✅ Gestión de piezas
- ✅ CRUD de piezas
- ✅ Listado de piezas
- ✅ Filtrado y búsqueda

**Endpoints principales**:
- `GET /api/pieces` - Listar piezas
- `GET /api/pieces/{id}` - Obtener pieza
- `POST /api/pieces` - Crear pieza
- `PUT /api/pieces/{id}` - Actualizar pieza
- `DELETE /api/pieces/{id}` - Eliminar pieza

**Base de datos**: PostgreSQL (pieces_db)

---

## 📝 Scripts Disponibles

```bash
# Inicia servidor de desarrollo con HMR
npm run dev

# Construye la aplicación para producción
npm run build

# Comprueba el linting del código
npm lint

# Previsualliza la build de producción localmente
npm run preview
```

---

## 🐳 Docker - Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs en tiempo real de un servicio
docker-compose logs -f auth_service
docker-compose logs -f pieces_service
docker-compose logs -f frontend

# Entrar en la shell de un contenedor
docker-compose exec auth_service /bin/bash
docker-compose exec pieces_service /bin/bash

# Ejecutar migraciones manualmente
docker-compose exec auth_service php artisan migrate

# Recrear contenedores sin cache
docker-compose up --build --force-recreate

# Eliminar volúmenes (PELIGRO: Elimina datos)
docker volume rm $(docker volume ls -q)
```

---

## 🔐 Variables de Entorno en Docker

El archivo `docker-compose.yml` contiene las siguientes variables:

```yaml
# Auth Service
DB_HOST: postgres_auth
DB_DATABASE: auth_db
DB_USERNAME: postgres
DB_PASSWORD: secret
JWT_SECRET: clave_super_secreta_compartida_cambiar_en_produccion

# Pieces Service
DB_HOST: postgres_pieces
DB_DATABASE: pieces_db
DB_USERNAME: postgres
DB_PASSWORD: secret
JWT_SECRET: clave_super_secreta_compartida_cambiar_en_produccion
```

⚠️ **IMPORTANTE**: En producción, cambia los valores de contraseñas y JWT_SECRET por valores seguros.

---

## 🆘 Troubleshooting

### ❌ Error: "Can't reach API at localhost:8001"

**Solución**:
1. Verifica que Docker está corriendo: `docker ps`
2. Levanta los servicios: `docker-compose up -d`
3. Espera 2-3 minutos a que los servicios inicien
4. Verifica: `curl http://localhost:8001/api/health`

### ❌ Error: "Port 5173 already in use"

**Solución**:
```bash
# Encuentra el proceso que usa el puerto 5173
lsof -i :5173

# Mata el proceso (en Windows):
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### ❌ Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solución**: Verifica que los microservicios tienen CORS habilitado. Esto se configura en el backend.

### ❌ Error: "PostgreSQL connection refused"

**Solución**:
1. Reconstruye los contenedores: `docker-compose down -v && docker-compose up -d`
2. Espera a que PostgreSQL inicie completamente (verifica con `docker-compose logs postgres_auth`)

### ❌ Error: "npm ERR! 404 Not Found"

**Solución**:
```bash
# Limpia caché y reinstala
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error: "Dockerfile not found"

**Solución**:
```bash
# Verifica que los Dockerfiles existan
ls -la docker/
ls -la Dockerfile

# Si no existen, clone el repositorio nuevamente
```

---

