# ROM GYM

Registro de entrenamiento de hipertrofia. Elegís la rutina del día, anotás cada
serie mientras entrenás y seguís tu progresión de cargas.

**App:** https://romaniguido.github.io/ROM---GYM/

## Qué hace

- Seis rutinas precargadas (Piernas A, Piernas B, Pecho + Bíceps, Espalda +
  Tríceps, Hombros, Abdomen), editables.
- Registro de series en dos toques, con la columna **Anterior** para repetir lo
  de la última vez y autocompletado de la serie siguiente.
- Timer de descanso automático con vibración y sonido.
- Detección de récords personales (1RM estimado, fórmula de Epley).
- Estadísticas: series por semana, series por grupo muscular con la franja de
  referencia 10–20, progresión por ejercicio y tabla de mejores marcas.
- Funciona sin señal y se instala en la pantalla de inicio.

## Dónde viven los datos

En el navegador del dispositivo (`localStorage`). No hay servidor ni cuenta: la
app no envía nada a ningún lado. Desde *Rutinas → Datos* se puede descargar una
copia `.json` y restaurarla en otro teléfono.

## Estructura

| Archivo | Para qué |
|---|---|
| `index.html` | La app entera: un solo archivo, sin dependencias ni build |
| `sw.js` | Service worker: deja la app disponible sin internet |
| `manifest.webmanifest` | Permite instalarla en la pantalla de inicio |
| `icon.svg`, `icon-maskable.svg` | Ícono de la app |
| `build.ps1` | Regenera `index.html` a partir del fuente `../rom-gym.html` |
| `serve.ps1` | Servidor local para probar antes de publicar (`http://localhost:8787`) |
