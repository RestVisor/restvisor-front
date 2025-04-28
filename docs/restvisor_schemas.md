# Restvisor Database Schema

This document details the database schema for the Restvisor project.

## Tables

### 1. `order_details`

| Column      | Type    | Nullable | Default | Description                |
| ----------- | ------- | -------- | ------- | -------------------------- |
| id          | bigint  | false    | -       | Primary key                |
| pedido_id   | bigint  | true     | -       | Foreign key to orders.id   |
| producto_id | integer | true     | -       | Foreign key to products.id |
| cantidad    | integer | true     | 1       | Quantity of product        |

**Relationships:**

-   `pedido_id` references `orders.id`
-   `producto_id` references `products.id`

### 2. `tables`

| Column | Type    | Nullable | Default                           | Description                                         |
| ------ | ------- | -------- | --------------------------------- | --------------------------------------------------- |
| id     | integer | false    | nextval('mesas_id_seq'::regclass) | Primary key                                         |
| numero | integer | false    | -                                 | Table number (unique)                               |
| estado | text    | false    | -                                 | Table status ('disponible', 'ocupada', 'reservada') |

**Constraints:**

-   `estado` must be one of: 'disponible', 'ocupada', 'reservada'

**Referenced by:**

-   `orders.tableNumber` references `tables.id`

### 3. `orders`

| Column      | Type    | Nullable | Default     | Description                 |
| ----------- | ------- | -------- | ----------- | --------------------------- |
| id          | bigint  | false    | -           | Primary key                 |
| tableNumber | integer | true     | -           | Foreign key to tables.id    |
| status      | text    | true     | 'pendiente' | Order status                |
| created_at  | text    | true     | -           | Creation timestamp          |
| active      | boolean | true     | false       | Whether the order is active |

**Constraints:**

-   `status` must be one of: 'pending', 'en preparación', 'listo', 'entregado'

**Relationships:**

-   `tableNumber` references `tables.id`

**Referenced by:**

-   `order_details.pedido_id` references `orders.id`

### 4. `products`

| Column      | Type    | Nullable | Default                               | Description         |
| ----------- | ------- | -------- | ------------------------------------- | ------------------- |
| id          | integer | false    | nextval('productos_id_seq'::regclass) | Primary key         |
| name        | text    | false    | -                                     | Product name        |
| description | text    | true     | -                                     | Product description |
| price       | numeric | false    | -                                     | Product price       |
| category    | text    | true     | -                                     | Product category    |
| stock       | integer | false    | 1                                     | Available stock     |

**Constraints:**

-   `stock` must be greater than or equal to 0

**Referenced by:**

-   `order_details.producto_id` references `products.id`

### 5. `users`

| Column   | Type        | Nullable | Default                              | Description         |
| -------- | ----------- | -------- | ------------------------------------ | ------------------- |
| id       | integer     | false    | nextval('usuarios_id_seq'::regclass) | Primary key         |
| name     | text        | false    | -                                    | User name           |
| email    | text        | false    | -                                    | User email (unique) |
| password | text        | false    | -                                    | User password       |
| role     | role (enum) | false    | 'waiter'                             | User role           |

**Constraints:**

-   `email` must be unique
-   `role` must be one of: 'admin', 'waiter', 'chef'
