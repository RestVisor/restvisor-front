# RestVisor - Producción de Software - Sprint 0

---

## Portada

**Asignatura**: Producción de Software  
**Título del Proyecto**: RestVisor  
**Grupo**: 4  

**Integrantes**:

1. Antonio Hidalgo Mora  
2. Adonaí Hernández Bolaños  
3. Hugo González Portilla  
4. Francisco Javier López-Dufour Morales  
5. Elena Artiles Morales  

---

## Índice

1. [Introducción](#introducción)  
2. [Plan de Trabajo (Calendario)](#plan-de-trabajo-calendario)  
3. [Pila de Producto](#pila-de-producto)  
   - [Historias de Usuario (HU)](#historias-de-usuario)  
   - [Historias Técnicas (HT)](#historias-técnicas)  
   - [Criterios de Prioridad y Estimación](#criterios-de-prioridad-y-estimación)  
4. [Organización del Sprint Zero](#organización-del-sprint-zero)  
5. [Conclusión](#conclusión)  

---

## Introducción

El proyecto **RestVisor** consiste en el desarrollo de una aplicación web orientada a la gestión de pedidos en restaurantes. Su propósito fundamental es **facilitar la toma de comandas** por parte de los camareros mediante dispositivos móviles, ofreciendo además una **sincronización en tiempo real** con la cocina y un **control actualizado** de las mesas (disponibles, ocupadas o reservadas).

El sistema está compuesto por:  
- Un **frontend** en **React**, para proporcionar una interfaz moderna e intuitiva.  
- Un **backend** en **Express.js**, encargado de la lógica de negocio y la comunicación con la base de datos.  
- Una **base de datos relacional** (PostgreSQL o MySQL) donde se almacenan los datos de productos, mesas y pedidos.

La aplicación busca **agilizar el trabajo** del personal de sala, reducir errores en las comandas y ofrecer **reportes** que ayuden a la gerencia a analizar la actividad del restaurante (volúmenes de venta, horas pico, productos más vendidos, etc.). Además, **RestVisor** incluirá un sistema de roles y usuarios que permita distinguir el uso de la aplicación entre camareros, cocineros y administradores.

---

## Plan de Trabajo (Calendario)

Según el calendario propuesto y adaptado a nuestro trabajo en clase, contamos con **4 semanas** para el desarrollo del **Sprint 0**. Cada semana disponemos de **6 horas** (4 presenciales en aula + 2 en casa), y somos **5 desarrolladores** en el equipo.

- **Horas totales** de trabajo del equipo por sprint = 5 desarrolladores * 6 horas/semana * 4 semanas = **120 horas**.

El siguiente calendario describe las **fechas aproximadas** y las **tareas principales** de cada semana:

| Semana | Fechas          | Horas totales (Equipo) | Objetivos principales                                                                                                                                                                                     |
|--------|-----------------|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | (Del 10 al 16 de Marzo) | 30 horas               | - Configurar repositorio Git y entorno (Node, React). <br/> - Definir y crear la BD inicial (tablas: Mesas, Productos, Pedidos). <br/> - Diseñar boceto de la interfaz React (mapa/listado de mesas).      |
| 2      | (Del XX al XX) | 30 horas               | - Implementar endpoints básicos en Express para Mesas (GET, PUT, etc.). <br/> - Conectar React con la API de Mesas para mostrar estado en tiempo real. <br/> - Empezar CRUD de Productos.                 |
| 3      | (Del XX al XX) | 30 horas               | - Desarrollar la lógica de toma de pedidos (Frontend + Backend). <br/> - Asignar pedidos a mesas y enviar orden a cocina. <br/> - Crear roles de usuario (Camarero, Admin) y autenticación básica (JWT).    |
| 4      | (Del XX al XX) | 30 horas               | - Integrar cocina (cambios de estado en pedidos). <br/> - Validar cambios de estado de mesas (ocupada, libre, reservada). <br/> - Ajustes finales, pruebas y documentación necesaria para cierre del Sprint 0. |

> **Nota**: Las fechas exactas pueden ajustarse al calendario oficial y a la disponibilidad del equipo.

---

## Pila de Producto

La **pila de producto** se compone de las **Historias de Usuario (HU)** y las **Historias Técnicas (HT)** consideradas esenciales para cubrir el flujo principal de RestVisor. La prioridad está determinada por la **importancia para el negocio** (iniciar el restaurante), las **dependencias técnicas** y el **esfuerzo** requerido.

### Historias de Usuario

#### HU01 - Gestión de Mesas

- **HU01.1 Visualización del estado de las mesas**  
  1. **Identificador**: HU01.1  
  2. **Nombre**: Visualización del estado de las mesas  
  3. **Descripción**: Como camarero, quiero ver un mapa o listado con las mesas y su estado actualizado para saber dónde asignar clientes.  
  4. **Criterios de validación**:  
     - La interfaz muestra las mesas con su estado (Disponible, Ocupada, Reservada).  
     - No requiere recargar la página para ver cambios.  
  5. **Estimación**: 6 puntos  
  6. **Prioridad**: Alta  
  7. **Notas adicionales**: Depende de la configuración de la BD y la API de Mesas (HT01, HT02).

- **HU01.2 Cambio de estado de una mesa**  
  1. **Identificador**: HU01.2  
  2. **Nombre**: Cambio de estado de una mesa  
  3. **Descripción**: Como camarero, quiero poder actualizar el estado de una mesa (disponible, ocupada, reservada).  
  4. **Criterios de validación**:  
     - Actualizar estado en tiempo real.  
     - No permite marcar como "Disponible" si hay un pedido activo.  
  5. **Estimación**: 5 puntos  
  6. **Prioridad**: Alta  

- **HU01.3 Reservar una mesa con antelación**  
  1. **Identificador**: HU01.3  
  2. **Nombre**: Reservar una mesa  
  3. **Descripción**: Como administrador, quiero dejar una mesa marcada como reservada a una hora concreta para clientes que llamen con antelación.  
  4. **Criterios de validación**:  
     - Bloqueo de mesa en esa franja horaria.  
     - Posible notificación al camarero cuando se aproxime la hora de la reserva.  
  5. **Estimación**: 4 puntos  
  6. **Prioridad**: Media  

#### HU02 - Toma de Pedidos Digital

- **HU02.1 Selección de productos para un pedido**  
  1. **Identificador**: HU02.1  
  2. **Nombre**: Selección de productos para un pedido  
  3. **Descripción**: Como camarero, quiero ver un catálogo de productos para agregar al pedido.  
  4. **Criterios de validación**:  
     - El catálogo muestra nombre, precio y descripción.  
     - Puedo sumar o eliminar productos antes de confirmar.  
  5. **Estimación**: 5 puntos  
  6. **Prioridad**: Alta  

- **HU02.2 Asignación de pedido a una mesa**  
  1. **Identificador**: HU02.2  
  2. **Nombre**: Asignación de pedido a mesa  
  3. **Descripción**: Como camarero, quiero vincular el pedido con la mesa adecuada para controlarlo.  
  4. **Criterios de validación**:  
     - Solo se puede asignar a mesas ocupadas o reservadas.  
     - Se refleja en la vista de la mesa que hay un pedido activo.  
  5. **Estimación**: 4 puntos  
  6. **Prioridad**: Alta  

- **HU02.3 Enviar pedido a cocina**  
  1. **Identificador**: HU02.3  
  2. **Nombre**: Enviar pedido a cocina  
  3. **Descripción**: Como camarero, quiero que el pedido se registre en la base de datos y aparezca en la interfaz de cocina como "Pendiente".  
  4. **Criterios de validación**:  
     - Notificación (opcional) cuando el pedido se envía.  
     - El pedido cambia de estado a "Pendiente".  
  5. **Estimación**: 6 puntos  
  6. **Prioridad**: Alta  

- **HU02.4 Modificar pedido antes de enviarlo**  
  1. **Identificador**: HU02.4  
  2. **Nombre**: Modificar pedido antes de enviarlo  
  3. **Descripción**: Como camarero, quiero rectificar productos o cantidades antes de enviar definitivamente el pedido a cocina.  
  4. **Criterios de validación**:  
     - No se permite editar tras haber sido enviado a cocina.  
     - Registro de cambios en el historial del pedido.  
  5. **Estimación**: 5 puntos  
  6. **Prioridad**: Media  

#### HU03 - Sincronización con Cocina

- **HU03.1 Recepción de pedidos en cocina**  
  1. **Identificador**: HU03.1  
  2. **Nombre**: Recepción de pedidos en cocina  
  3. **Descripción**: Como cocinero, quiero ver en tiempo real qué pedidos llegan para empezar a prepararlos.  
  4. **Criterios de validación**:  
     - Listado de pedidos con sus detalles (productos y cantidades).  
     - Filtro por estado (pendiente, en preparación, listo).  
  5. **Estimación**: 6 puntos  
  6. **Prioridad**: Alta  

- **HU03.2 Cambio de estado de un pedido en cocina**  
  1. **Identificador**: HU03.2  
  2. **Nombre**: Actualizar estado del pedido (Cocina)  
  3. **Descripción**: Como cocinero, quiero marcar los pedidos como "En preparación" o "Listo" para notificar al camarero.  
  4. **Criterios de validación**:  
     - Notificación instantánea a la vista del camarero.  
     - Un pedido "Listo" no puede volver atrás.  
  5. **Estimación**: 4 puntos  
  6. **Prioridad**: Alta  

- **HU03.3 Notificación al camarero cuando un pedido está listo**  
  1. **Identificador**: HU03.3  
  2. **Nombre**: Notificación de pedido listo  
  3. **Descripción**: Como camarero, quiero recibir un aviso cuando la cocina marque un pedido como "Listo" para poder servirlo.  
  4. **Criterios de validación**:  
     - Avisa con alerta visual/sonora.  
     - Se indica la mesa a la que pertenece el pedido.  
  5. **Estimación**: 5 puntos  
  6. **Prioridad**: Media  

#### HU04 - Gestión de Productos

1. **Identificador**: HU04  
2. **Nombre**: Gestión de Productos  
3. **Descripción**: Como administrador, deseo añadir, editar o eliminar productos en el menú para mantenerlo actualizado.  
4. **Criterios de validación**:  
   - CRUD con restricciones de rol (solo admin).  
   - Cambios reflejados en el frontend sin recarga completa.  
5. **Estimación**: 5 puntos  
6. **Prioridad**: Media  

#### HU05 - Personalización de Pedidos

1. **Identificador**: HU05  
2. **Nombre**: Personalización de Pedidos  
3. **Descripción**: Como camarero, quiero añadir notas (ej. "sin tomate") para cada producto del pedido.  
4. **Criterios de validación**:  
   - Notas visibles para cocina en el pedido.  
   - Edición posible antes de enviar el pedido a cocina.  
5. **Estimación**: 3 puntos  
6. **Prioridad**: Media  

#### HU06 - Historial de Pedidos

1. **Identificador**: HU06  
2. **Nombre**: Historial de Pedidos  
3. **Descripción**: Como gerente, quiero consultar pedidos previos para analizar volúmenes de venta y tiempos de preparación.  
4. **Criterios de validación**:  
   - Posibilidad de filtrar por fecha y mesa.  
   - Solo accesible a roles con permisos (admin).  
5. **Estimación**: 7 puntos  
6. **Prioridad**: Media  

#### HU07 - Edición de Productos Disponibles

1. **Identificador**: HU07  
2. **Nombre**: Edición de Productos Disponibles  
3. **Descripción**: Como administrador, necesito modificar disponibilidad y precios de los productos en tiempo real.  
4. **Criterios de validación**:  
   - Cambios de disponibilidad se ven reflejados instantáneamente en la UI de camareros.  
   - Permisos restringidos a administradores.  
5. **Estimación**: 6 puntos  
6. **Prioridad**: Alta  

#### HU08 - Página de Inicio (Landing Page)

1. **Identificador**: HU08  
2. **Nombre**: Página de Inicio de RestVisor  
3. **Descripción**: Como usuario no registrado, quiero ver una página de inicio atractiva que presente RestVisor, sus características principales y beneficios para mi negocio de restauración.  
4. **Criterios de validación**:  
   - Diseño moderno y responsive que funcione en dispositivos móviles y escritorio.
   - Secciones claras que muestren las características principales del producto.
   - Llamadas a la acción (CTA) para registro/prueba del producto.
   - Ejemplos visuales del producto en uso.
   - Información de contacto y soporte.
5. **Estimación**: 5 puntos  
6. **Prioridad**: Alta  

### Historias Técnicas

#### HT01 - Creación de la Base de Datos
- **Identificador**: HT01  
- **Nombre**: Creación de la Base de Datos  
- **Descripción**: Definir las tablas (Mesas, Productos, Pedidos, Usuarios) y sus relaciones.  
- **Criterios de validación**: BD lista para consultas CRUD y escalabilidad básica.  
- **Estimación**: 8 puntos  
- **Prioridad**: Alta  

#### HT02 - Mapa de Mesas (Frontend React)
- **Identificador**: HT02  
- **Nombre**: Implementación del Mapa de Mesas  
- **Descripción**: Vista en React que muestre las mesas y su estado en tiempo real.  
- **Estimación**: 8 puntos  
- **Prioridad**: Alta  

#### HT03 - Backend para Pedidos (Express.js)
- **Identificador**: HT03  
- **Nombre**: Implementación del Backend para Pedidos  
- **Descripción**: Endpoints para CRUD de pedidos y actualización de estado.  
- **Estimación**: 7 puntos  
- **Prioridad**: Alta  

#### HT04 - Integración BD con la Interfaz (React + Express)
- **Identificador**: HT04  
- **Nombre**: Integración BD-Front  
- **Descripción**: Conexión del frontend React con la BD mediante APIs REST y/o WebSockets.  
- **Estimación**: 5 puntos  
- **Prioridad**: Media  

### Criterios de Prioridad y Estimación

- **Prioridad**: Se basa en la relevancia para el flujo principal del restaurante (alta, media, baja). Primero se cubren las funcionalidades mínimas para operar (mesas, pedidos, cocina).  
- **Estimación**: Usamos puntos de historia para reflejar el **esfuerzo** relativo de cada tarea. Nos guiamos por la complejidad técnica, los posibles riesgos y la cantidad de funcionalidades internas que requieran.

---

## Organización del Sprint Zero

Para el **Sprint Zero**, hemos decidido incluir las historias y tareas esenciales para que el proyecto sea mínimamente funcional:

1. **HT01 - Creación de la Base de Datos** (8 puntos, alta).  
2. **HT02 - Mapa de Mesas (Frontend React)** (8 puntos, alta).  
3. **HU01.1 Visualización del estado de las mesas** (6 puntos, alta).  
4. **HU01.2 Cambio de estado de una mesa** (5 puntos, alta).  
5. **HU02.1 Selección de productos** (5 puntos, alta) – si el tiempo lo permite.

> Con esto, pretendemos **levantar la base de datos**, mostrar las **mesas en React** y permitir el **cambio de estado** entre ocupada/disponible. La selección de productos (HU02.1) se atacará si cumplimos con el tiempo programado.

- **Total estimado de puntos** para Sprint 0: 8 (HT01) + 8 (HT02) + 6 (HU01.1) + 5 (HU01.2) + 5 (HU02.1) = **32 puntos**.  
- Las tareas serán repartidas entre los 5 integrantes, utilizando las **120 horas** disponibles (4 semanas * 6 horas/semana * 5 personas). Ajustaremos si detectamos desvíos importantes.

---

## Conclusión

Este documento define la **estructura básica** y planificación inicial para desarrollar **RestVisor** en un contexto académico dentro de 4 semanas. La prioridad es cumplir el **MVP** de control de mesas, toma de pedidos y sincronización con la cocina, dejando funcionalidades más avanzadas (facturación, informes) para sprints posteriores.

El **calendario** y la **pila de producto** guiarán la ejecución del proyecto. Al finalizar el **Sprint Zero**, revisaremos los **puntos de historia estimados** y anotaremos los reales para mejorar la precisión de futuras estimaciones.

---
