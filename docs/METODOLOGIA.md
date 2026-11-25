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


## Formulario de ecuaciones y componentes

**Bienes y servicios:** Y = C + I + G + X − M; el equilibrio implica OA = DA. Las funciones de consumo, ingreso disponible, inversión, gasto público y sector externo se consultan por separado, porque un componente puede depender de otras variables. La función de consumo se expresa como C = C₀ + PmgC × Yd; los determinantes de Yd se muestran cualitativamente como en las presentaciones, sin inventar coeficientes.

**Mercado laboral:** DL responde a producción y tecnología; OL a condiciones de oferta como migración y capacitación. El salario de equilibrio modifica el ingreso disponible y puede generar retornos posteriores sobre C.

**Mercado monetario:** Ms responde a instrumentos del BCCR y Md a sus determinantes cualitativos, incluidos Y y la deuda interna. La tasa de interés ajusta el equilibrio; una alteración de Md no desplaza automáticamente LM.

**Mercado cambiario:** O$ se relaciona con los ingresos de divisas y D$ con sus salidas. El tipo de cambio afecta exportaciones e importaciones, conforme a los supuestos del caso.

## Diagnóstico de política económica

El diagnóstico opcional presenta cuatro situaciones didácticas: identifica el punto inicial, la variable de interés (Y o i), el instrumento fiscal o monetario y la evaluación posterior. Las combinaciones de excesos de los mercados de bienes, dinero y divisas no quedan agotadas por cuatro ejemplos. El desplazamiento de IS debe tener una causa distinta de un movimiento de i por sí solo; LM se desplaza con Ms; BP requiere revisar el canal externo.

La geometría es ilustrativa. La tendencia concreta mostrada en E1 → E2 debe distinguirse de la conclusión cualitativa que puede extraerse sin magnitudes. Una política no asegura el equilibrio simultáneo IS–LM–BP.
