# Contribuir a Macro Studio

Agradecemos aportes que mejoren la precisión económica, la trazabilidad o la accesibilidad de la aplicación.

## Reportar un error

Indicá: (1) nombre de la variable/shock; (2) dirección; (3) mercado de inicio; (4) ruta/hipótesis seleccionada; (5) secuencia esperada con su justificación; (6) resultado obtenido y una captura cuando sea útil.

Separá los problemas de **lógica económica** de los de **presentación visual**. Una curva superpuesta no demuestra por sí sola un error en el cálculo, y un cálculo técnicamente consistente tampoco prueba una interpretación económica correcta.

## Proponer cambios

1. Explicá qué regla o interfaz cambia y cuál es su evidencia o motivación.
2. Incluí al menos un escenario que falle antes y pase después.
3. Conservá los casos de regresión y ejecutá `python tests/test_app.py`.
4. Verificá también mapa causal, narrativas y visualización IS–LM–BP.
5. No agregues nombres, transcripciones ni material de terceros sin autorización.

Las modificaciones deberían mantenerse sincronizadas entre notebook, aplicación estática y fuentes de inspección.

**Licencia pendiente:** por ahora no existe una licencia abierta para contribuciones; antes de enviar código, contactá al autor para confirmar las condiciones de uso.
