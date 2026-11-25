# Publicar Macro Studio en GitHub

**Repositorio público:** [`juaniflls/macro-studio`](https://github.com/juaniflls/macro-studio).

## Datos y estructura del repositorio

En https://github.com/new completá:

- **Owner:** `juaniflls`
- **Repository name:** `macro-studio`
- **Descripción:** `Simulador interactivo de macroeconomía en español: cuatro mercados, efectos de primer y segundo orden, diagramas causales y modelo IS–LM–BP.`
- **Visibilidad:** Público (si deseás mostrarlo públicamente)
- **Añadir README:** Desactivado (el paquete ya contiene uno)
- **Añadir .gitignore:** Ninguno (el paquete ya contiene uno)
- **Licencia:** MIT, disponible en `LICENSE`.

Este repositorio ya existe. Si clonás otro ejemplar o preparás una copia, subí los archivos descomprimidos; no el ZIP como único archivo.

## Cargar con Git desde Terminal

```bash
git init
git branch -M main
git add .
git commit -m "Publicación inicial de Macro Studio 5.0"
git remote add origin https://github.com/juaniflls/macro-studio.git
git push -u origin main
```

Si el repositorio ya existe, primero clonalo en lugar de inicializar una carpeta desconectada. GitHub puede pedir iniciar sesión con GitHub CLI, token o credencial configurada. No pegues contraseñas ni tokens en el repositorio.

## Licencia y versiones

El código se distribuye bajo licencia MIT. El lanzamiento inicial se etiqueta `v5.0.0`. Los archivos `index.html` y el notebook contienen la aplicación publicada. GitHub Linguist excluye los HTML generados del porcentaje de lenguajes mediante `.gitattributes`; esto no modifica los archivos ni convierte JavaScript en Python.

## Habilitar el sitio

Abrí **Settings → Pages → Build and deployment**, elegí *Deploy from a branch*, rama `main`, carpeta `/(root)`, y guardá. El sitio quedará en `https://juaniflls.github.io/macro-studio/` una vez que GitHub complete el despliegue.

## Configuración opcional de la página principal

En la sección de información del repositorio (**About**), podés agregar estos temas de búsqueda:

`macroeconomia`, `economia`, `simulacion-economica`, `educacion-economica`, `diagramas-causales`, `jupyter-notebook`, `javascript`, `is-lm-bp`, `espanol`.

No marques la aplicación como validada empíricamente: es un simulador cualitativo con criterios de clase.
