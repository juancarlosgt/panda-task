# 🐼 Panda Task - Gestión de Tareas

Una aplicación moderna de gestión de tareas y proyectos construida con Vue.js 3 y Tailwind CSS.

## ✨ Características

### 🔐 Autenticación
- **Registro e Inicio de Sesión** con JWT
- **Protección de Rutas** - Acceso restringido a usuarios autenticados
- **Persistencia de Sesión** usando localStorage
- **Logout seguro**

### 📋 Gestión de Proyectos
- **Crear y gestionar** múltiples proyectos
- **Vista Kanban** con columnas y tarjetas de tareas
- **Interfaz drag & drop** (próximamente)
- **Colaboración en equipo** (próximamente)


## 🚀 Tecnologías Utilizadas

- **Frontend**: Vue.js 3, Vue Router, Pinia
- **Estilos**: Tailwind CSS
- **HTTP Client**: Axios
- **Autenticación**: JWT (JSON Web Tokens)
- **Iconos**: Heroicons (SVG)

## 🛠 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/juancarlosgt/panda-task.git
   cd panda-task
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Editar `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Compilar para producción**
   ```bash
   npm run build
   ```


## 🎯 Uso de la Aplicación

### Para Usuarios Nuevos
1. **Registrarse** en `/login` (formulario de registro)
2. **Iniciar sesión** con sus credenciales
3. **Crear primer proyecto** desde el sidebar
4. **Añadir columnas** al proyecto (ej: "Por hacer", "En progreso", "Completado")
5. **Crear tareas** en las columnas correspondientes

### Funcionalidades Principales
- **Sidebar**: Navegación entre proyectos, crear nuevos proyectos
- **Board Kanban**: Visualizar y organizar tareas en columnas
- **Header**: Acceso rápido a perfil y logout
- **Modales**: Crear proyectos, columnas y tareas de forma intuitiva

## 🔒 Seguridad

- **Tokens JWT** almacenados de forma segura
- **Protección de rutas** con guards de Vue Router
- **Interceptores de Axios** para incluir tokens automáticamente
- **Validación de expiración** de tokens

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Sidebar expandido, vista completa
- **Tablet**: Sidebar colapsable, layout adaptativo
- **Mobile**: Vista móvil optimizada

## 🚧 Próximas Características

- [ ] **Drag & Drop** de tareas entre columnas
- [ ] **Edición en línea** de tareas y columnas
- [ ] **Fechas de vencimiento** y recordatorios
- [ ] **Etiquetas y categorías** para tareas
- [ ] **Búsqueda y filtros** avanzados
- [ ] **Modo oscuro**
- [ ] **Colaboración en tiempo real**


## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Desarrollado con ❤️ usando Vue.js y Tailwind CSS**
