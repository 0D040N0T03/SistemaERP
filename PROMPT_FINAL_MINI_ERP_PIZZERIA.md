# Prompt final - Mini ERP Pizzeria

Desarrolla el frontend completo de un MINI ERP de ventas e inventario para una pizzeria usando unicamente HTML, CSS y JavaScript vanilla, sin React, Vue, Angular, Bootstrap ni Tailwind.

El sistema sera utilizado internamente por empleados y administradores. No debe parecer una tienda online ni una app delivery. Debe verse como un ERP/POS empresarial real, enfocado en rapidez operativa, administracion interna y claridad visual.

## Estilo visual

El diseno debe ser profesional, minimalista, limpio, empresarial, moderno, ordenado, rapido visualmente, facil de mantener, modular y escalable.

Evitar estilos gamer, ecommerce, delivery, exceso de sombras, animaciones exageradas, colores oscuros fuertes e interfaces sobrecargadas.

Usar fondos blancos o gris muy suave, detalles verdes modernos, tablas limpias, formularios compactos, botones sobrios, navegacion rapida, badges de estado, tarjetas modernas y tipografia limpia tipo Inter o Arial.

Paleta:

- Verde principal: `#15803D`
- Verde suave: `#EAF7EF`
- Fondo general: `#F6F8FA`
- Blanco: `#FFFFFF`
- Texto principal: `#1F2937`
- Texto secundario: `#6B7280`
- Borde gris: `#E5E7EB`
- Rojo suave: `#DC2626`
- Amarillo alertas: `#F59E0B`

El diseno debe estar optimizado principalmente para escritorio, pero adaptable a tablets.

## Objetivo tecnico

El proyecto debe quedar preparado para conectarse posteriormente a un backend monolitico en Spring Boot usando APIs REST y `fetch()`.

La primera version sera un prototipo frontend. No usar `localStorage` como persistencia. Usar datos simulados centralizados en `data.js` y exponerlos mediante `services.js`.

Toda lectura futura de datos debe pasar por `services.js`, para que luego pueda reemplazarse por llamadas `fetch()` sin reescribir las pantallas.

Mantener separacion de responsabilidades:

- Los archivos HTML definen la estructura visual y contenedores.
- CSS define presentacion.
- JavaScript controla eventos, estado de interfaz y render de datos.
- Evitar escribir grandes bloques de HTML como strings dentro de JavaScript.
- Para render dinamico, preferir manipular nodos del DOM, reutilizar contenedores existentes o usar plantillas HTML.

## Estructura del proyecto

```text
mini-erp-pizzeria/
├── login.html
├── admin.html
├── cajero.html
├── cocina.html
├── pages/
│   ├── dashboard.html
│   ├── ventas.html
│   ├── catalogo.html
│   ├── inventario.html
│   ├── personas.html
│   └── reportes.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── login.css
│   ├── admin.css
│   ├── pos.css
│   └── cocina.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── admin.js
│   ├── cajero.js
│   ├── cocina.js
│   ├── services.js
│   ├── data.js
│   └── modules/
│       ├── dashboard.js
│       ├── ventas.js
│       ├── catalogo.js
│       ├── inventario.js
│       ├── personas.js
│       └── reportes.js
└── assets/
    └── img/
```

## Login y roles

Debe existir un solo login para todos los usuarios.

Segun el rol:

- Administrador -> `admin.html`
- Cajero -> `cajero.html`
- Cocina -> `cocina.html`

El login debe simular validacion usando `USUARIO`, `ROL` y `EMPLEADO`.

Roles principales:

- Administrador: acceso total.
- Cajero: registrar pedidos, generar boletas y cancelar un pedido antes de guardarlo.
- Cocina: ver pedidos y cambiar estado operativo.

Usuarios no se eliminan, se desactivan con `estado = false`.

## Logica central del negocio

La pizzeria atiende localmente. El cliente da su nombre, paga, recibe su boleta y espera su pedido.

Flujo principal:

```text
Cajero registra pedido
-> cliente obligatorio por nombre
-> se genera boleta inmediatamente
-> se aplican promociones automaticas por producto
-> se descuenta inventario segun composicion PRODUCTO_INSUMO
-> cocina recibe pedido pendiente
-> cocina cambia estado a Preparando o Atendido
-> admin puede anular pedidos
-> si se anula un pedido, el stock debe devolverse conceptualmente
```

Estados de pedido:

- Pendiente
- Preparando
- Atendido
- Anulado

El pedido anulado se conserva para reportes y auditoria.

## Productos, insumos y composicion

`PRODUCTO` representa lo que se vende en el POS.

`INSUMO` representa lo que se controla en inventario.

`PRODUCTO_INSUMO` define la composicion o receta de cada producto.

Reglas:

- Las pizzas son productos preparados.
- Las gaseosas y bebidas tambien son productos vendibles.
- Las bebidas pueden existir tambien como insumos inventariables.
- Una gaseosa producto se vincula a un insumo gaseosa mediante `PRODUCTO_INSUMO` con cantidad 1.
- El Kardex controla solo insumos.
- Las ventas de productos se analizan desde `DETALLE_PEDIDO`.

Para esta primera version:

- No calcular cuantas pizzas pueden prepararse segun insumos.
- `PRODUCTO.stock` puede ser `NULL` para productos preparados.
- `PRODUCTO.stock` puede mostrar stock visible para productos terminados simples como bebidas.
- El stock real del inventario sigue estando en `INSUMO.stock`.
- Si faltan insumos al registrar un pedido, el POS debe mostrar alerta.

## Promociones y combos

Las promociones se activan o desactivan desde admin usando `PROMOCION.activa`.

No es obligatorio manejar fechas en esta version.

Las promociones se aplican automaticamente sobre productos incluidos.

Los combos se registran como productos con precio propio y se componen con `COMBO_PRODUCTO`.

Los combos deben descontar inventario indirectamente segun los productos que incluyen.

## POS Cajero

El POS debe ser rapido y operativo.

Distribucion:

- izquierda: categorias
- centro: productos como botones
- derecha: pedido actual

El cajero primero elige categoria y luego producto.

No usar imagenes de producto por ahora.

El pedido debe mostrar:

- productos
- cantidad
- observacion por detalle
- descuento aplicado
- subtotal
- IGV fijo 18%
- total
- cliente obligatorio
- telefono opcional
- metodo de pago

Metodos de pago:

- Efectivo
- Tarjeta
- Yape
- Plin

No manejar pago mixto en esta version.

El cajero puede cancelar solo el pedido que esta registrando antes de guardarlo.

## Cocina

Cocina no debe ver precios ni totales.

Debe ver pedidos ordenados del mas antiguo al mas nuevo.

Debe mostrar:

- numero de pedido
- hora
- cliente
- productos
- cantidades
- observaciones por producto
- estado

Botones:

- Preparando
- Atendido

No agregar sonido ni alertas en esta version.

## Administrador

`admin.html` debe actuar como contenedor principal del ERP.

Debe tener:

- sidebar fijo izquierdo
- header superior
- area dinamica de contenido

El sidebar muestra todas las secciones directas, sin desplegables.

Internamente las pantallas se agrupan por archivos:

- `ventas.html`: Pedidos, Clientes, Boletas, Metodos de pago
- `catalogo.html`: Productos, Categorias, Recetas/Composicion, Promociones, Combos
- `inventario.html`: Insumos, Unidades de medida, Compras, Movimientos, Kardex
- `personas.html`: Empleados, Usuarios, Roles, Proveedores
- `reportes.html`: Ventas, Compras, Productos mas vendidos, Movimientos de inventario, Pedidos anulados

La navegacion debe usar:

- `data-page`
- `data-section`
- manipulacion del DOM
- clases `active` y `hidden`

Ejemplo:

```html
<button data-page="ventas" data-section="pedidos">Pedidos</button>
<button data-page="catalogo" data-section="productos">Productos</button>
<button data-page="inventario" data-section="kardex">Kardex</button>
```

## Formularios y acciones

Los formularios deben ir dentro de cada seccion, no como modales principales.

Cada seccion debe incluir botones operativos aunque sean simulados:

- Nuevo
- Editar
- Desactivar
- Anular cuando aplique
- Ver detalle cuando aplique

Reglas:

- Productos no se eliminan, se marcan como no disponibles.
- Usuarios no se eliminan, se desactivan.
- Pedidos anulados se conservan.
- Admin puede crear y editar productos.
- Admin puede crear y editar recetas/composicion.
- Admin puede crear usuarios y editar roles.

## Inventario, compras y Kardex

El Kardex sera solo de insumos.

Debe mostrar:

- fecha
- insumo
- documento
- tipo de movimiento
- entrada
- salida
- stock resultante

Compras:

```text
Admin registra compra
-> se guarda COMPRA
-> se guarda DETALLE_COMPRA
-> el sistema genera MOVIMIENTO de Entrada
-> se guarda DETALLE_MOVIMIENTO por cada insumo
-> se actualiza INSUMO.stock
```

En la interfaz el usuario solo registra la compra. El movimiento de entrada se genera automaticamente a nivel logico.

Movimientos manuales:

- merma
- ajuste
- perdida

Las mermas se manejan como salidas de insumo.

`INSUMO` debe tener `stock_minimo` para alertas.

## Reportes simples

Reportes iniciales:

- ventas del dia
- pedidos pendientes
- productos mas vendidos
- insumos bajo stock
- compras recientes
- movimientos recientes
- pedidos anulados

Las ventas se calculan desde:

- `PEDIDO`
- `DETALLE_PEDIDO`
- `PRODUCTO`
- `BOLETA`
- `METODO_PAGO`

El inventario se calcula desde:

- `INSUMO`
- `MOVIMIENTO`
- `DETALLE_MOVIMIENTO`
- `TIPO_MOVIMIENTO`

## Preparacion para Spring Boot

`services.js` debe centralizar la lectura y escritura simulada.

Endpoints futuros sugeridos:

```text
POST /auth/login
GET /api/dashboard/resumen
GET /api/pedidos
POST /api/pedidos
PATCH /api/pedidos/{id}/estado
PATCH /api/pedidos/{id}/anular
GET /api/clientes
GET /api/productos
POST /api/productos
GET /api/categorias
GET /api/recetas
GET /api/insumos
POST /api/compras
GET /api/movimientos
GET /api/kardex
GET /api/empleados
GET /api/usuarios
POST /api/usuarios
GET /api/roles
GET /api/proveedores
GET /api/reportes/ventas
GET /api/reportes/inventario
```

El resultado final debe verse como un ERP empresarial real: profesional, rapido, modular, limpio, entendible, escalable, preparado para backend Spring Boot y organizado internamente por categorias.
