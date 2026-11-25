const REFERENCE_CASES = {
  "infra:1": {
    "goods": [
      [
        "Al aumentar el gasto público (G) eso genera que la Demanda Agregada aumente. Porque: DA = C + I + G + X − M. Donde G es gasto público.",
        "Al Nivel de producción de equilibrio anterior la DA2 es mayor a la OA generándose un exceso de demanda agregada.",
        "Los inventarios de los productores se empiezan a agotar, hay presión para que suban los precios e incentivos para aumentar la producción (Ye1).",
        "Se alcanza un nuevo equilibrio con un nivel de producción mayor (Ye2) con inflación"
      ],
      [
        "Al aumentar los salarios eso genera que la Demanda Agregada aumente. Porque: DA = C + I + G + X − M. Donde C es consumo.",
        "Al Nivel de producción de equilibrio anterior la DA3 es mayor a la OA generándose un exceso de demanda agregada.",
        "Los inventarios de los productores se empiezan a agotar, hay presión para que suban los precios e incentivos para aumentar la producción (Ye2).",
        "Se alcanza un nuevo equilibrio con un nivel de producción mayor (Ye3) con inflación"
      ]
    ],
    "labor": [
      [
        "Al aumentar la producción nacional (Ye1 a Ye2) aumenta la demandada de trabajo (DL).",
        "Al salario de equilibrio anterior (We1) la cantidad demandada de trabajo (DL2) es mayor a la cantidad ofrecida de trabajo (OL). Hay un exceso de demanda de trabajo",
        "Los empresas con tal de conseguir los empleados están dispuestos a que el salario aumente (We1 a We2).",
        "Nuevo equilibrio. Encontramos un nuevo equilibrio (E2) donde la cantidad ofrecida y demanda de trabajo son iguales pero a un nivel de salario mayor (We2) y a un nivel de empleo mayor (Le2)."
      ],
      [
        "Al aumentar la producción nacional (Ye2 a Ye3) aumenta la demandada de trabajo (DL).",
        "Al salario de equilibrio anterior (We2) la cantidad demandada de trabajo (DL3) es mayor a la cantidad ofrecida de trabajo (OL). Hay un exceso de demanda de trabajo",
        "Los empresas con tal de conseguir los empleados están dispuestos a que el salario aumente (We2 a We3).",
        "Nuevo equilibrio. Encontramos un nuevo equilibrio (E3) donde la cantidad ofrecida y demanda de trabajo son iguales pero a un nivel de salario mayor (We3) y a un nivel de empleo mayor (Le3)."
      ]
    ],
    "money": [
      [
        "Al aumentar la producción nacional (Ye1 a Ye2) aumenta la Demanda de Dinero (Md1) y se dezplaza la curva de demanda monetaria a la derecha",
        "A la tasa de interés de equilibrio anterior (ie1) la Oferta de Dinero (Ms1) es menor a la Demanda de Dinero (Md2) generándose un exceso de Demanda de Dinero.",
        "Hay presión para que la tasa de interés (ie1) suba a ie2.",
        "Se genera un nuevo equilibrio a una tasa de interés más alta (E1 a E2)."
      ]
    ],
    "fx": [
      [
        "Al aumentar la producción nacional (Ye1 a Ye2), aumentan las importaciones (M) del país y, por tanto, la demanda de dólares (D$1 a D$2).",
        "Al tipo de cambio de equilibrio anterior (TCe1) existe ahora un exceso de demanda de dólares.",
        "Ese exceso de demanda genera presión para que el tipo de cambio aumente (Tce2).",
        "Finalmente, se alcanza un nuevo equilibrio con un tipo de cambio mayor (E2)."
      ]
    ],
    "is": [
      "Al haber aumentado la Demanda Agregada DA2 sin afectar i1 entonces la curva IS1 se desplaza hacia la derecha (IS2)."
    ]
  },
  "tipo_cambio_exo:-1": {
    "goods": [
      [
        "Al disminuir el tipo de cambio aumentan las importaciones lo que genera que la Demanda Agregada disminuya. Porque: DA = C + I + G + (X − M). Donde M (IMPORTACIONES).",
        "Al Nivel de producción de equilibrio anterior la DA2 es menor a la OA generándose un exceso de OA.",
        "Los inventarios de los productores se empiezan a acumular, hay presión para que bajen los precios e incentivos para disminuir la producción (Ye1).",
        "Se alcanza un nuevo equilibrio con un nivel de producción menor (Ye2) sin presión para que haya inflación"
      ],
      [
        "Al disminuir los salarios eso genera que la Demanda Agregada disminuya. Porque: DA = C + I + G + (X − M). Donde C es consumo.",
        "Al Nivel de producción de equilibrio anterior la DA3 es menor a la OA generándose un exceso de OA.",
        "Los inventarios de los productores se empiezan a acumular, hay presión para que bajen los precios e incentivos para disminuir la producción (Ye2).",
        "Se alcanza un nuevo equilibrio con un nivel de producción menor (Ye3) sin presión para que haya inflación"
      ]
    ],
    "labor": [
      [
        "Al disminuir la producción nacional (Ye1 a Ye2)se disminuye la demandada de trabajo (DL).",
        "Al salario de equilibrio anterior (We1) la cantidad demandada de trabajo (DL2) es menor a la cantidad de trabajo (OL). Hay un exceso de oferta de trabajo (OL)",
        "Los trabajadores con tal de conseguir empleo están dispuestos a que el salario baje (We1 a We2).",
        "Nuevo equilibrio. Encontramos un nuevo equilibrio (E2) donde la cantidad ofrecida y demanda de trabajo son iguales pero a un nivel de salario menor (We2) y a un nivel de empleo menor (Le2)."
      ],
      [
        "Al disminuir la producción nacional (Ye2 a Ye3)se disminuye la demandada de trabajo (DL2).",
        "Al salario de equilibrio anterior (We2) la cantidad demandada de trabajo (DL3) es menor a la cantidad ofrecida de trabajo (OL). Hay un exceso de oferta de trabajo (OL)",
        "Los trabajadores con tal de conseguir empleo están dispuestos a que el salario baje (We2 a We3).",
        "Nuevo equilibrio. Encontramos un nuevo equilibrio (E3) donde la cantidad ofrecida y demanda de trabajo son iguales pero a un nivel de salario menor (We3) y a un nivel de empleo menor (Le3)."
      ]
    ],
    "money": [
      [
        "Al disminuir la producción nacional (Ye1 a Ye2) disminuye la Demanda de Dinero (Md1) y se dezplaza la curva de demanda monetaria a la izquierda",
        "A la tasa de interés de equilibrio anterior (ie1) la Oferta de Dinero (Ms1) es mayor a la Demanda de Dinero (Md2) generándose un exceso de Oferta de Dinero.",
        "Hay presión para que la tasa de interés (ie1) baje a ie2.",
        "Se genera un nuevo equilibrio a una tasa de interés mas baja (E1 a E2)."
      ]
    ],
    "fx": [
      [
        "Al disminuir la producción nacional (Ye1 a Ye2), disminuyen las importaciones (M) del país y, por tanto, la demanda de dólares (D$1 a D$2).",
        "Al tipo de cambio de equilibrio anterior (TCe1) existe ahora un exceso de oferta de dólares (O$1).",
        "Ese exceso de oferta genera presión para que el tipo de cambio disminuya (Tce2).",
        "Finalmente, se alcanza un nuevo equilibrio con un tipo de cambio menor (E2)."
      ]
    ],
    "is": [
      "Al haber disminuido la Demanda Agregada DA2 sin afectar i1 entonces la curva IS1 se desplaza hacia la izquierda (IS2)."
    ]
  },
  "tasas_nacionales:-1": {
    "goods": [
      [
        "Al disminuir la tasa de interés (i) eso genera que la Demanda Agregada aumente. Porque: DA = C + I + G + X − M. Donde I (INVERSIÓN) dada por F(i).",
        "Al Nivel de producción de equilibrio anterior la DA2 es mayor a la OA generándose un exceso de demanda agregada.",
        "Los inventarios de los productores se empiezan a agotar, hay presión para que suban los precios e incentivos para aumentar la producción (Ye1).",
        "Se alcanza un nuevo equilibrio con un nivel de producción mayor (Ye2) con inflación"
      ]
    ],
    "labor": [
      [
        "Al aumentar la producción nacional (Ye1 a Ye2) aumenta la demandada de trabajo (DL).",
        "Al salario de equilibrio anterior (We1) la cantidad demandada de trabajo (DL2) es mayor a la cantidad de trabajo (OL). Hay un exceso de demanda de trabajo",
        "Los empresas con tal de conseguir los empleados están dispuestos a que el salario aumente (We1 a We2).",
        "Nuevo equilibrio. Encontramos un nuevo equilibrio (E2) donde la cantidad ofrecida y demanda de trabajo son iguales pero a un nivel de salario mayor (We2) y a un nivel de mayor (Le2)."
      ]
    ],
    "money": [
      [
        "Al aumentar la producción nacional (Ye1 a Ye2) aumenta la Demanda de Dinero (Md1) y se dezplaza la curva de demanda monetaria a la derecha",
        "A la tasa de interés de equilibrio anterior (ie1) la Oferta de Dinero (Ms1) es menor a la Demanda de Dinero (Md2) generándose un exceso de Demanda de Dinero.",
        "Hay presión para que la tasa de interés (ie1) suba a ie2.",
        "Se genera un nuevo equilibrio a una tasa de interés más alta (E1 a E2)."
      ]
    ],
    "fx": [
      [
        "Al aumentar la producción nacional (Ye1 a Ye2), aumentan las importaciones (M) del país y, por tanto, la demanda de dólares (D$1 a D$2).",
        "Al tipo de cambio de equilibrio anterior (TCe1) existe ahora un exceso de demanda de dólares.",
        "Ese exceso de demanda genera presión para que el tipo de cambio aumente (Tce2).",
        "Finalmente, se alcanza un nuevo equilibrio con un tipo de cambio mayor (E2)."
      ]
    ],
    "is": [
      "Al haber disminuido la tasa de interés y haber aumentado la inversión la curva IS1 no se mueve, es un movimiento sobre la curva a i2 en E2."
    ]
  },
  "importaciones:1": {
    "goods": [
      [
        "Al aumentar las importaciones genera que la Demanda Agregada disminuya. Porque: DA = C + I + G + (X − M). Donde M (IMPORTACIONES).",
        "Al Nivel de producción de equilibrio anterior la DA2 es menor a la OA generándose un exceso de OA.",
        "Los inventarios de los productores se empiezan a acumular, hay presión para que bajen los precios e incentivos para disminuir la producción (Ye1).",
        "Se alcanza un nuevo equilibrio con un nivel de producción menor (Ye2) sin presión para que haya inflación"
      ]
    ],
    "labor": [
      [
        "Al disminuir la producción nacional (Ye1 a Ye2) se disminuye la demanda de trabajo (DL).",
        "Al salario de equilibrio anterior (We1) la cantidad demandada de trabajo (DL2) es menor a la cantidad de trabajo (OL). Hay un exceso de oferta de trabajo (OL)",
        "Los trabajadores con tal de conseguir empleo están dispuestos a que el salario baje (We1 a We2).",
        "Nuevo equilibrio. Encontramos un nuevo equilibrio (E2) donde la cantidad ofrecida y demanda de trabajo son iguales pero a un nivel de salario menor (We2) y a un nivel de empleo menor (Le2)."
      ]
    ],
    "money": [
      [
        "Al disminuir la producción nacional (Ye1 a Ye2) disminuye la Demanda de Dinero (Md1) y se dezplaza la curva de demanda monetaria a la izquierda",
        "A la tasa de interés de equilibrio anterior (ie1) la Oferta de Dinero (Ms1) es mayor a la Demanda de Dinero (Md2) generándose un exceso de Oferta de Dinero.",
        "Hay presión para que la tasa de interés (ie1) baje a ie2.",
        "Se genera un nuevo equilibrio a una tasa de interés mas baja (E1 a E2)."
      ]
    ],
    "fx": [
      [
        "Al disminuir la producción nacional (Ye1 a Ye2), disminuyen las importaciones (M) del país y, por tanto, la demanda de dólares (D$1 a D$2).",
        "Al tipo de cambio de equilibrio anterior (TCe1) existe ahora un exceso de oferta de dólares (O$1).",
        "Ese exceso de oferta genera presión para que el tipo de cambio disminuya (Tce2).",
        "Finalmente, se alcanza un nuevo equilibrio con un tipo de cambio menor (E2)."
      ]
    ],
    "is": [
      "Al haber disminuido la Demanda Agregada DA2 sin afectar i1 entonces la curva IS1 se desplaza hacia la izquierda (IS2)."
    ]
  }
};
