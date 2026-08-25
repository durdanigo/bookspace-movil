# 📚 BookSpace Móvil

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Aplicación móvil desarrollada para **BookSpace**, una plataforma para la administración y reserva de espacios, catálogo de libros y servicios en una librería-cafetería. Diseñada con una arquitectura modular y gestión de estado desacoplada para garantizar una navegación fluida y una experiencia de usuario óptima.

---

## ✨ Características Principales

- 🔐 **Autenticación y Sesiones:** Inicio de sesión y registro de usuarios gestionados mediante `AuthContext` y almacenamiento persistente.
- 📅 **Agenda y Calendario:** Visualización y gestión de fechas de reserva para salas de lectura y áreas comunes.
- 📖 **Exploración de Catálogo:** Consulta de libros y productos con filtros rápidos por etiquetas (`FiltroChips`) y búsqueda interactiva.
- ⚡ **Retroalimentación Dinámica:** Vistas de carga con componentes esqueleto (`Esqueleto`), badges de estado y modales detallados de registro.
- 🎨 **Diseño Personalizado:** Sistema de diseño centralizado con paleta de colores y temas consistentes.

---

## 📂 Estructura del Proyecto

```text
BookSpaceMovil/
├── assets/             # Recursos gráficos, íconos y splash screen
├── src/
│   ├── api/            # Configuración y cliente HTTP para la REST API
│   ├── components/     # Componentes UI reutilizables (Tarjetas, Filtros, Modales)
│   ├── context/        # Contextos globales de estado (AuthContext)
│   ├── screens/        # Vistas y flujos de navegación principales
│   └── theme/          # Paletas cromáticas y estilos globales
├── App.js              # Punto de entrada y proveedor de contexto
├── app.json            # Configuración del ecosistema Expo
└── package.json        # Dependencias y scripts del proyecto