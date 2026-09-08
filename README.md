# ♠️S502-blackjack-app-frontend♣️
Frontend web para la app de Blackjack, desarrollado en **React**. Permite jugar partidas contra la banca, registro/login con JWT, ver perfil, ranking y panel de administración para admins.

---

## 📚 Tabla de Contenidos

- [📝 Descripción](#descripción)
- [✨ Características](#características)
- [🛠️ Tecnologías](#tecnologías)
- [📂 Estructura del repositorio](#estructura-del-repositorio)
- [⚡ Instalación y ejecución local](#instalación-y-ejecución-local)
- [🚀 App desplegada](#app-desplegada)
- [🔗 API Backend](#api-backend)
- [👤 Autor](#autor)

---

## 📝 Descripción

Este frontend React conecta con la API de BlackjackApp (Spring WebFlux) y permite a cualquier usuario:

- Registrarse e iniciar sesión (JWT)
- Jugar al Blackjack vs Dealer
- Consultar su perfil y ranking
- Cambiar su alias
- Panel admin para gestionar jugadores y roles (si el usuario tiene permisos)

---

## ✨ Características

- Autenticación y persistencia JWT (en localStorage)
- Interfaz visual atractiva y responsiva
- Gestión de partidas y ranking en tiempo real
- Acceso restringido por roles a paneles de administración
- Integración directa con la API segura (backend)
- Animaciones y estilos personalizados (Blackjack theme)

---

## 🛠️ Tecnologías

- ⚛️ React 18+
- 🗂️ React Router DOM
- 💅 CSS Modules / Tailwind / Styled Components (según setup)
- 🔐 JWT para auth
- 🪝 Custom Hooks
- 🌐 Axios o Fetch

---

## 📂 Estructura real del repositorio

```
S502-blackjack-app-frontend/
├── public/
│   ├── bg-casino.jpg
│   ├── favicon.ico
│   ├── logo-blackjack-transparent.png
│   ├── logo-login3.png
│   └── cards/
│       └── * imágenes de las cartas
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   └── PrivateRoute.jsx
│   ├── pages/
│   │   ├── AdminPanel.jsx
│   │   ├── Game.jsx
│   │   ├── Login.jsx
│   │   ├── MainMenu.jsx
│   │   ├── Profile.jsx
│   │   ├── Ranking.jsx
│   │   └── Register.jsx
│   └── services/
│       └── api.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

---

## ⚡ Instalación y ejecución local

1. **Clona el repositorio:**

```bash
git clone https://github.com/Jusep1983/S502-blackjack-app-frontend.git
cd S502-blackjack-app-frontend
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Configura la URL de la API backend:**

   - Copia `.env.example` a `.env` y pon la URL real del backend si vas a usar local/producción:

   ```bash
   VITE_API_URL=http://localhost:8080/
   # o la URL de tu backend desplegado
   ```

4. **Ejecuta la app en desarrollo:**

```bash
npm run dev
```

5. **Abre **[**http://localhost:5173**](http://localhost:5173)** en tu navegador.**

---

## 🚀 App desplegada

Puedes probar el frontend en producción aquí:

➡️ [**https://s502-blackjack-app-frontend.onrender.com/**](https://s502-blackjack-app-frontend.onrender.com/)

- Se conecta automáticamente al backend desplegado.
- Puedes registrarte, hacer login, jugar, cambiar alias, ver ranking y (si eres admin) gestionar usuarios.

---
## 👀 ¡Prueba la app completa desplegada!

> Puedes probar **la experiencia completa** (frontend y backend conectados) en producción:
>
> ➡️ [**https://s502-blackjack-app-frontend.onrender.com/**](https://s502-blackjack-app-frontend.onrender.com/)
>
> - Solo tienes que registrarte y jugar.
> - El backend está en la nube y operativo.
> - Ranking, perfil, panel admin... ¡todo funcionando!

---

## 🔗 API Backend

> El backend está en otro repositorio (Java Spring WebFlux):
>
> [https://github.com/Jusep1983/S502\_BlackjackApp](https://github.com/Jusep1983/S502_BlackjackApp)
>
> Consulta allí para detalles de endpoints, seguridad y despliegue del backend.

---

## 👤 Autor

Desarrollado por [Jusep1983](https://github.com/Jusep1983)

---

**¡Pull requests, sugerencias y estrellas son bienvenidas! 🥳**
