# Arquitectura y flujo de ejecución

## Dos artefactos principales

1. **`index.html`** es la aplicación web autocontenida, lista para abrir en un navegador y publicar como sitio estático.
2. **`Macro_Studio_5_0_Final_Notebook_Generador.ipynb`** es el notebook generador autocontenido. Define las plantillas HTML/CSS y la lógica JavaScript y escribe un archivo HTML listo para abrir.

Los archivos `src/` se extrajeron de `index.html` para facilitar inspección y revisión por separado; **no son dependencias en tiempo de ejecución**. Cambiar `src/app.js` por sí solo no actualiza el `index.html` ni el notebook. Para cambios permanentes, editá el notebook fuente, generá el HTML nuevamente y sincronizá la copia estática.

## Componentes

- `src/engine.js`: catálogo de shocks, reglas de propagación, hipótesis y descripción del efecto.
- `src/references.js`: textos de referencia de escenarios utilizados en clase.
- `src/app.js`: gestión de casos y colecciones, visualización SVG, mapa causal, interacciones y exportaciones.
- `src/styles.css`: estilos del espacio de trabajo, gráficos y vista exposición.

## Datos de usuario

El navegador usa `localStorage` para guardar colecciones y casos en ese mismo dispositivo. Esto **no** equivale a sincronización entre equipos. La exportación JSON permite respaldar/importar el trabajo; la exportación HTML permite compartir una presentación generada. No hay backend ni cuentas en la aplicación autónoma.

## Reproducibilidad

```bash
python -m pip install jupyterlab
jupyter lab
```

Ejecutá todas las celdas del notebook. Para pruebas de interfaz:

```bash
python -m pip install -r requirements-dev.txt
python -m playwright install chromium
python tests/test_app.py
```

Las pruebas producen artefactos en `tests/out/`, excluidos por `.gitignore`.
