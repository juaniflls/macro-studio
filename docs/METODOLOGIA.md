# Modelo económico y convenciones de Macro Studio

Este documento describe las reglas cualitativas que el motor **declara** y representa; no es una calibración empírica.

## Mercados y variables resultado

| Mercado | Variable resultado | Curvas y relaciones usuales |
| --- | --- | --- |
| Bienes y servicios | Producción nacional **Y** | Demanda agregada **DA** y oferta agregada del esquema docente; **DA = C + I + G + X − M**. |
| Laboral | Salarios **W** y empleo **L** | Oferta laboral **OL** y demanda laboral **DL**. |
| Monetario | Tasa de interés **i** | Oferta monetaria **Ms** y demanda de dinero **Md**. |
| Cambiario | Tipo de cambio **TC** | Oferta de dólares **O$** y demanda de dólares **D$**. |

## Transmisión

1. Seleccionar variable explicativa y dirección del shock.
2. Identificar mercado o mercados iniciales: algunos shocks pueden actuar de forma simultánea.
3. Transmitir cambios mediante variables resultado, de mercado a mercado.
4. Registrar primer y segundo orden conforme a los recorridos del esquema docente.
5. Cuando haya efectos contrapuestos, declarar el canal que se toma como predominante; la aplicación no estima ponderaciones.
6. Derivar narrativas, flechas y curvas a partir de la misma representación interna.

## IS, LM y BP

- **IS:** cambia cuando se modifican componentes autónomos de la demanda agregada; un cambio de inversión causado **solo** por la variación de la tasa de interés implica un movimiento a lo largo de la curva IS, no su desplazamiento.
- **LM:** en la convención del curso se desplaza por cambios de la oferta monetaria **Ms** instrumentados por el banco central. Las variaciones inducidas de **Md** pueden alterar la tasa de interés en el mercado monetario sin desplazar LM.
- **BP:** el modelo docente vincula cambios autónomos en entradas y salidas de divisas con desplazamientos de BP. Un cambio aislado de la tasa de interés no desplaza automáticamente BP.

El equilibrio **IS–LM** se representa en la intersección correspondiente. El estado externo no se fuerza artificialmente a intersectar ese mismo punto si no se han establecido condiciones suficientes.

## Ejemplo de ruta

En el escenario *inversión extranjera directa ↓* con inicio cambiario:

`IED ↓ → O$ ↓ → TC ↑ → (X − M) ↑ → DA ↑ → Y ↑`

Después, Y afecta DL, Md y D$; la retroalimentación puede producir canales de segundo orden. Si se elige un **inicio doble** IED→I y IED→O$, las rutas y los supuestos deben declararse separadamente.

## Alcance y cautelas

- Las flechas representan **direcciones** y los equilibrios son **cualitativos**.
- Los escenarios que incorporan elasticidades o efectos contrapuestos no obtienen magnitudes por simple suma de flechas.
- Empleo de equilibrio ≠ tasa de desempleo sin información adicional sobre la fuerza laboral.
- El ejemplo de IED admite más de una interpretación dependiendo de la hipótesis de partida.
- La aprobación de una presentación de clase no demuestra la validez universal de cualquier escenario creado por terceros.

## Contexto

El proyecto sistematiza la metodología de ejercicios trabajada con Ronney Zamora Leiva en Macroeconomía II (Universidad Fidélitas, 2026). Se conserva la terminología docente para mantener trazabilidad. No se redistribuyen las presentaciones de clase ni transcripciones originales en el repositorio público.
