# 🧸 Bordado Perfecto · Área de Miembros Infantil & Acogedora

Una plataforma moderna, acogedora y minimalista diseñada especialmente para talleres y artesanas del bordado computarizado, con un catálogo completo de más de **3.700 matrices infantiles** organizadas por temas, colecciones y marcas de máquinas bordadoras.

---

## ✨ Características Principales & Diferenciales

1. **Diseño Acogedor & Minimalista (Estilo Infantil / Taller de Bordado)**:
   - Paleta de colores en tonos pasteles cálidos (Rosa Fresa Bebé, Amarillo Mantequilla, Menta Suave, Azul Nube y Lino Natural).
   - Detalles artesanales con costuras decorativas pespunteadas (*embroidery dashed stitches*) en tarjetas y botones.
   - Tipografía tierna y súper legible: **Fredoka** para títulos redondos y **Nunito** para especificaciones técnicas y lectura clara.
   - Microinteracciones agradables y suaves, sin sobrecarga visual y con cero efectos borrosos molestos.

2. **Enlaces de Acceso Originales & Compatibilidad Total**:
   - Todas las **3.764 portadas** se visualizan en alta definición directamente desde el servidor.
   - Descarga individual de cada matriz en los 5 formatos principales:
     - **PES** (Brother, Baby Lock, Bernina Deco)
     - **JEF** (Janome, Elna, Kenmore)
     - **DST** (Tajima, Barudan, Industriales, SWF)
     - **EXP** (Bernina, Melco)
     - **XXX** (Singer, Compucon)
   - Descarga directa de **cada colección completa en formato ZIP**.
   - Descarga directa de **todo el catálogo completo en un único archivo ZIP** en el formato seleccionado.

3. **Búsqueda Instantánea Inteligente & Bilingüe**:
   - Búsqueda en tiempo real sin pausas ni lentitud.
   - Insensible a mayúsculas, minúsculas y tildes/acentos.
   - Soporte para términos en español y portugués (ej: buscar *"oso"* o *"urso"*, *"corazón"* o *"coração"*, *"león"*, *"ajuar"*, etc.).
   - Botones con sugerencias rápidas (Ositos, Safari, Bebé y Ajuar, Jardín, Alfabetos, Dinosaurios, Princesas).

4. **Filtros Avanzados y Ordenamiento**:
   - **Filtro por Bastidor**: 10×10 cm, 13×18 cm, 14×14 cm, 16×26 cm, 20×30 cm.
   - **Filtro por Puntadas**: Ligero (< 10k pts), Medio (10k a 25k pts), Denso (> 25k pts).
   - **Filtro por Colores**: 1 color (monocromático), 2 a 4 colores, 5 o más colores.
   - **Ordenamiento**: Nombre (A-Z o Z-A), Menos puntadas primero, Más puntadas primero, Menor tamaño, Mayor tamaño.
   - **Modo de Vista**: Vista Normal Confortable o Vista Compacta Rápida.

5. **Ficha Técnica Detallada en el Modal**:
   - Vista previa amplia de la matriz.
   - Dimensiones reales en centímetros y milímetros.
   - Sugerencia del bastidor ideal recomendado.
   - Total de puntadas y tiempo estimado de bordado (a 650 puntadas/min).
   - Botones de descarga en los 5 formatos con indicación de la máquina de la usuaria.
   - Botón para compartir enlace directo (`#mat=ID`).

6. **Selector de Máquina Inteligente**:
   - Guarda la máquina preferida en el navegador (`localStorage`).
   - Todos los botones del sitio se adaptan automáticamente para descargar en la extensión correcta.

7. **Sistema de Favoritos**:
   - Guarda tus matrices favoritas con un clic en el corazón (♥).
   - Pestaña exclusiva con todos los diseños guardados en tu dispositivo para acceso rápido.

8. **Guía Paso a Paso "Cómo Bordar"**:
   - Tutorial en 5 pasos para transferir y bordar cualquier diseño desde la memoria USB.
   - Consejos profesionales sobre estabilizadores / entretelas, agujas y tensión de hilos.

9. **Sonidos Tiernos (Web Audio API)**:
   - Efectos sonoros suaves sintetizados al guardar favoritos o interactuar.
   - Botón para activar o silenciar los sonidos en cualquier momento.

10. **Diseño Móvil con Barra Inferior**:
    - Navegación optimizada para teléfonos celulares con barra inferior rápida (Inicio, Categorías, Colecciones, Favoritos, Menú).

---

## 🚀 Cómo Abrir y Usar

Simplemente abre el archivo **`index.html`** en cualquier navegador moderno (Chrome, Edge, Safari, Firefox).

Para correr en un servidor local:
```bash
# Con Node.js
node server.js
# Abre: http://localhost:3000
```

---

## ⚙️ Estructura del Proyecto

- **`index.html`**: Estructura en español con navegación, modales y barra móvil.
- **`styles.css`**: Hoja de estilos con diseño minimalista pastel, sin desfoques.
- **`app.js`**: Controlador en español LATAM con búsqueda inteligente, filtros, favoritos y descargas.
- **`catalogo.js`**: Base de datos completa con las 3.764 matrices, 12 categorías y 30 colecciones.
- **`server.js`**: Servidor local ligero para pruebas.
