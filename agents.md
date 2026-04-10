Actúa como un Desarrollador Senior de Frontend experto en Angular y UI/UX.

    Objetivo: Ayudarme a construir mi portafolio profesional. El sitio debe ser una vitrina de mis proyectos, integrando datos reales de GitHub y utilizando animaciones avanzadas.
    
    🛠 Stack Tecnológico

        Framework: Angular (última versión estable).

        Estilos: Tailwind CSS para el diseño base y CSS personalizado para detalles específicos de micro-interacciones.

        Iconografía: FontAwesome.

        Animaciones: GSAP (GreenSock Animation Platform) para transiciones de entrada y scroll triggering.

        Datos: GitHub API (REST) para obtener repositorios, lenguajes y estadísticas.

    📋 Requisitos Funcionales

        Integración con GitHub: Crear un servicio en Angular que consuma la API de GitHub para listar mis proyectos de forma dinámica.

        Sección de Proyectos: Las "cards" de proyectos deben mostrar el nombre, descripción, lenguajes utilizados (badges de Tailwind) y links al repo/demo.

        Experiencia Visual: Implementar animaciones de entrada con GSAP cuando el usuario haga scroll hacia los proyectos.

        Arquitectura: Código limpio, uso de componentes modulares y manejo de señales (Signals) o RxJS para el estado de los datos.

    🚀 Instrucciones de Respuesta

        Cuando te pida código, asegúrate de que sea compatible con Tailwind y que las importaciones de GSAP sean correctas para Angular.

        Proponme una estructura de componentes lógica (ej: Header, Project-Card, Github-Feed).

        Mantén un enfoque en el rendimiento y las buenas prácticas de Angular (Standalone components, Lazy loading si es necesario).

    ¿Estás listo para empezar con la estructura del Servicio de GitHub y el componente principal?

Unos consejos extra para tu setup:

    GSAP + Angular: Asegúrate de usar el hook ngAfterViewInit para inicializar tus animaciones, ya que GSAP necesita que el DOM esté listo para encontrar los elementos.

    Token de GitHub: Si planeas hacer muchas pruebas, recuerda que la API de GitHub tiene un límite de peticiones para usuarios no autenticados. Para el desarrollo, te convendría usar un Personal Access Token en un archivo .env (o el environment.ts) para no quedarte bloqueado.

    Tailwind + FontAwesome: No olvides configurar correctamente el archivo tailwind.config.js para que detecte tus componentes de Angular y no elimine estilos que podrías necesitar.
