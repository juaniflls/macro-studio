# Validación, límites y trazabilidad

## Evidencia incluida

`tests/resultados_qa_base.json` es el registro **aportado en el paquete fuente**, con 255 escenarios de prueba y 22 verificaciones funcionales. Documenta el alcance y los ejemplos comprobados en ese momento. Para verificar el estado actual del repositorio ejecutá `python tests/test_app.py`.

La suite recorre combinaciones de variables, signos, predominio y rutas de IED, además de verificar integridad del mapa y exportación de datos. Las pruebas de regresión se apoyan en `index.html` y Playwright + Chromium.

## Qué significan las pruebas

**Sí pueden comprobar:**
- Que el motor produce eventos definidos sin padres ausentes en el mapa.
- Que se mantienen los patrones de secuencias esperados para escenarios seleccionados.
- Que LM no cambia por un shock ajeno a Ms en la convención usada.
- Que seleccionar rutas/opciones cambia las relaciones y que las funciones de exportación respondan.

**No pueden demostrar:**
- Que cada uno de los escenarios del catálogo tenga una interpretación económica universal.
- Que los desplazamientos representen magnitudes calibradas o elasticidades estimadas.
- Que el software haya sido avalado institucionalmente.
- Que el resultado económico real pueda inferirse cuantitativamente sin datos y supuestos adicionales.

## Interpretación docente

Cada figura debe analizarse junto con la definición del shock y los canales escogidos. La distinción entre respuesta correcta bajo un supuesto y respuesta necesariamente única es esencial en shocks con múltiples rutas posibles.

## Regresión ejecutable

```bash
python -m pip install -r requirements-dev.txt
python -m playwright install chromium
python tests/test_app.py
```

Si Chromium no está disponible en Linux, instalalo con `python -m playwright install --with-deps chromium` o ejecutá la acción automática de GitHub incluida en el repositorio.
