# 🌐 Portfolio Landing Page

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Mi portfolio personal como Desarrollador Full-Stack especializado en IA & Soluciones Autónomas.

---

## 📜 Licencia

Este proyecto está bajo la [Licencia MIT](https://opensource.org/licenses/MIT).

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología           | Propósito                                                           |
| -------------------- | ------------------------------------------------------------------- |
| **Angular 21**       | Framework principal - arquitectura basada en componentes standalone |
| **TypeScript**       | Tipado estático para código robusto y mantenible                    |
| **Angular Material** | Componentes UI accesibles y responsivos                             |
| **Tailwind CSS v4**  | Utilidades CSS para styling rápido y consistente                    |
| **GSAP**             | Animaciones fluidas de alto rendimiento                             |
| **FontAwesome**      | Iconos escalables (SVG)                                             |

### Backend / SSR

| Tecnología                 | Propósito                                                |
| -------------------------- | -------------------------------------------------------- |
| **Express**                | Servidor Node.js para Server-Side Rendering (SSR)        |
| **Angular SSR**            | Renderizado del lado del servidor para SEO y performance |
| **NestJS** (en desarrollo) | Framework Node.js para APIs escalables                   |

### Base de Datos

| Tecnología     | Uso                                          |
| -------------- | -------------------------------------------- |
| **PostgreSQL** | Base de datos relacional principal           |
| **MySQL**      | Alternativa para proyectos específicos       |
| **MongoDB**    | Base de datos NoSQL para flexibilidad        |
| **Prisma ORM** | Abstracción de base de datos con type-safety |

### DevOps & Herramientas

| Herramienta              | Propósito                        |
| ------------------------ | -------------------------------- |
| **Docker**               | Containerización de servicios    |
| **Git / GitHub**         | Control de versiones y CI/CD     |
| **Vitest**               | Testing unitario                 |
| **Prettier**             | Formateo de código consistente   |
| **CI/CD GitHub Actions** | Automatización de builds y tests |

---

## 🤖 Uso de Agente de IA (opencode)

Este proyecto fue desarrollado con la asistencia de **[opencode](https://opencode.ai)**, un agente de IA especializado en ingeniería de software.

### Características del flujo de trabajo:

- **AGENTS.md**: Archivo de configuración que define reglas, personalidad y expertise del agente
- **Skills personalizadas**: Conjunto de habilidades especializadas almacenadas en `.agents/skill/`
- **Enfoque Spec-Driven Development (SDD)**: Metodología estructurada para desarrollo basado en especificaciones
- **Memoria persistente (Engram)**: Sistema de memoria que sobrevive entre sesiones para mantener contexto

### Skills utilizadas en este proyecto:

- `angular-rutas` - Manejo de rutas y navegación en Angular
- `APIs` - Integración y consumo de APIs RESTful
- `Accesibilidad (A11y)` - Implementación de estándares de accesibilidad web
- `responsive-phone` - Optimización para dispositivos móviles
- `angular-material` - Uso avanzado de componentes Angular Material
- `gsap-frontend` - Animaciones con GSAP en aplicaciones frontend
- `css-frontend` - Técnicas avanzadas de CSS y metodologías
- `tailwind-front` - Configuración y uso avanzado de Tailwind CSS
- `frontend-angular` - Arquitectura y patrones específicos para frontend Angular

---

## 🎨 Características del Portfolio

### Sección Hero

- Diseño moderno con gradientes animados de fondo
- Avatar con gradiente y texto con efecto "gradient-text"
- Botones CTA con efectos hover sofisticados
- Indicador de scroll animado

### Proyectos (Portfolio)

- **Integración con GitHub API** - Carga dinámica de repositorios públicos
- Grid responsivo (1/2/3 columnas según breakpoint)
- Cards con información del proyecto: lenguaje, estrellas, forks, topics
- Estados de carga y manejo de errores

### Habilidades (Skills)

- Barras de progreso visuales por categoría:
  - **Frontend**: Angular, TypeScript, SASS/CSS3, HTML5, Tailwind, GSAP, Angular Material
  - **Backend**: NestJS, Node.js, Express, Prisma, JWT, REST APIs
  - **Base de Datos**: PostgreSQL, MySQL, MongoDB
  - **IA**: Agentes Autónomos, Prompt Engineering, Integración de LLMs, Machine Learning, NLP
  - **Herramientas**: Docker, Git, Metodologías Ágiles, UML/DER

### Sección de Contacto

- Formulario convalidación usando Angular Material
- Campos: Nombre, Email, Asunto, Mensaje
- Diseño accesible y responsive

---

## 📁 Estructura del Proyecto

```
portfolio-landing-page/
├── src/
│   ├── app/
│   │   ├── home/           # Componente principal (hero)
│   │   ├── projects/       # Portfolio de proyectos (GitHub API)
│   │   ├── skills/         # Sección de habilidades
│   │   ├── contact/        # Formulario de contacto
│   │   ├── app.routes.ts   # Routing (SPA)
│   │   └── app.config.ts   # Configuración standalone
│   ├── styles.css          # Estilos globales
│   ├── material-theme.scss # Tema de Angular Material
│   ├── main.ts            # Bootstrap standalone
│   └── server.ts          # Express SSR server
├── .agents/
│   └── skill/             # Skills personalizadas de opencode
├── angular.json            # Configuración Angular CLI
├── package.json           # Dependencias npm
├── tsconfig.json          # Configuración TypeScript
├── tailwind.config.js     # Configuración Tailwind (v4)
└── AGENTS.md              # Configuración del agente opencode
```

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (localhost:4200)
npm start
# o
ng serve

# Build de producción
npm run build

# SSR producción (servidor Express)
npm run serve:ssr:portfolio-landing-page

# Testing unitario (Vitest)
npm test

# Formatear código (Prettier)
npx prettier --write src/
```

---

## 🎯 Enfoque y Filosofía

- **Conceptos > Código**: Entiendo los fundamentos antes de implementar
- **Accesibilidad**: Componentes semantic HTML y ARIA labels
- **Performance**: SSR, lazy loading, optimización de bundles
- **Responsive Design**: Mobile-first con Tailwind CSS
- **Clean Architecture**: Separación de responsabilidades clara

---

## 🌟 Diferenciador

Este portfolio no es solo una página estática — integra:

1. **API dinâmica** - Proyectos en tiempo real desde GitHub
2. **SSR para SEO** - Contenido renderizado en servidor
3. **Animaciones profesionales** - GSAP para transiciones fluidas
4. **Tipado completo** - TypeScript strict mode
5. **Testing** - Unit tests con Vitest
6. **Desarrollo asistido por IA** - Uso estructurado de opencode para mantener calidad y consistencia

---

## 📧 Contacto

¿Interesado en trabajar juntos? ¿Tienes preguntas sobre el stack o la implementación?

Escríbeme a través del formulario en el portfolio o contribuye a este proyecto.

---

_Desarrollado con ❤️ usando Angular 21 + TypeScript + Tailwind CSS v4_
