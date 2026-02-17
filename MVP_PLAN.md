# Plan MVP - Merchanding Platform

## Objetivo

Construir un MVP funcional que permita a los usuarios registrarse, explorar productos/campañas, agregar al carrito, pagar con Stripe y ver sus pedidos. Un admin puede gestionar pedidos. Todo con arquitectura escalable para migrar a producción.

---

## Estado Actual

La base del proyecto está configurada:

- Vite + React 19 + TypeScript
- TanStack Router (file-based routing con auto code splitting)
- React Query + Zustand (stores de auth, cart, UI creados)
- Tailwind CSS v4 + shadcn/ui (configurado, sin componentes instalados)
- Supabase client + Axios con interceptors
- Utilidades base (formatters, constants, env config)

**Lo que falta:** tipos, servicios, hooks, componentes, páginas, rutas protegidas, integración con Stripe.

---

## Fase 1: Fundación de Tipos y Componentes UI

> Definir los tipos del dominio y los componentes base de shadcn/ui que se reutilizarán en todo el proyecto.

- [ ] 1.1 Crear tipos del dominio
  - [ ] `src/types/user.types.ts` — User, UserProfile, AuthResponse
  - [ ] `src/types/design.types.ts` — Design, DesignStatus, CreateDesignDto
  - [ ] `src/types/campaign.types.ts` — Campaign, CampaignStatus
  - [ ] `src/types/product.types.ts` — Product, ProductVariant, Size, Color
  - [ ] `src/types/cart.types.ts` — CartItem, CartState (refactor desde cartStore)
  - [ ] `src/types/order.types.ts` — Order, OrderItem, OrderStatus, CreateOrderDto
  - [ ] `src/types/api.types.ts` — ApiResponse, PaginatedResponse, ApiError
  - [ ] Actualizar `src/types/index.ts` con barrel exports

- [ ] 1.2 Instalar componentes shadcn/ui esenciales
  - [ ] Button, Input, Label, Textarea
  - [ ] Card, Dialog, Sheet (para drawers)
  - [ ] Select, Checkbox, RadioGroup
  - [ ] Table, Badge, Separator
  - [ ] Avatar, DropdownMenu
  - [ ] Skeleton (para loading states)
  - [ ] Form (integración con react-hook-form)
  - [ ] Toast (migrar de react-hot-toast o usar shadcn)

- [ ] 1.3 Crear componentes shared
  - [ ] `LoadingSpinner.tsx` — Spinner reutilizable
  - [ ] `EmptyState.tsx` — Estado vacío con icono, título, descripción y acción
  - [ ] `ErrorBoundary.tsx` — Catch de errores con fallback UI
  - [ ] `ImageWithFallback.tsx` — Imagen con placeholder y lazy loading

---

## Fase 2: Autenticación

> Login, registro y protección de rutas. El usuario puede crear cuenta e iniciar sesión.

- [ ] 2.1 Servicio de autenticación
  - [ ] `src/services/auth.service.ts` — signUp, signIn, signOut, getSession, getProfile

- [ ] 2.2 Hook de autenticación
  - [ ] `src/hooks/useAuth.ts` — Wrapper sobre authStore + Supabase auth con listener onAuthStateChange

- [ ] 2.3 Páginas de autenticación
  - [ ] `src/routes/(auth)/login.tsx` — Formulario de login con email/password
  - [ ] `src/routes/(auth)/register.tsx` — Formulario de registro con nombre, email, password

- [ ] 2.4 Rutas protegidas
  - [ ] `src/routes/(authenticated)/route.tsx` — Guard con beforeLoad que verifica sesión
  - [ ] `src/routes/(admin)/route.tsx` — Guard con beforeLoad que verifica rol admin

- [ ] 2.5 Layout con navegación
  - [ ] `src/components/layout/Header.tsx` — Logo, navegación, botón cart, avatar/login
  - [ ] `src/components/layout/Footer.tsx` — Links, copyright
  - [ ] Actualizar `__root.tsx` para usar Header y Footer reales

---

## Fase 3: Catálogo (Browse & Detail)

> El usuario puede explorar campañas y ver los detalles de productos.

- [ ] 3.1 Servicios de datos
  - [ ] `src/services/campaigns.service.ts` — getCampaigns, getCampaignById
  - [ ] `src/services/products.service.ts` — getProducts, getProductById, getProductsByCampaign

- [ ] 3.2 Hooks de datos
  - [ ] `src/hooks/useCampaigns.ts` — useQuery para listar y obtener campañas
  - [ ] `src/hooks/useProducts.ts` — useQuery para productos por campaña

- [ ] 3.3 Componentes del catálogo
  - [ ] `CampaignCard.tsx` — Card con imagen, título, descripción, precio desde
  - [ ] `CampaignGrid.tsx` — Grid responsive de CampaignCards
  - [ ] `ProductCard.tsx` — Card de producto con imagen, nombre, precio
  - [ ] `ProductVariantSelector.tsx` — Selector de talla/color

- [ ] 3.4 Páginas
  - [ ] `src/routes/browse.tsx` — Página de exploración con grid de campañas y filtros básicos
  - [ ] `src/routes/campaigns.$campaignId.tsx` — Detalle de campaña con productos, selector de variantes y botón agregar al carrito

---

## Fase 4: Carrito de Compras

> El usuario puede agregar, modificar y eliminar items del carrito.

- [ ] 4.1 Hook del carrito
  - [ ] `src/hooks/useCart.ts` — Wrapper sobre cartStore con lógica de negocio

- [ ] 4.2 Componentes del carrito
  - [ ] `AddToCartButton.tsx` — Botón con feedback visual (toast) al agregar
  - [ ] `CartItem.tsx` — Item con imagen, nombre, cantidad editable, precio, botón eliminar
  - [ ] `CartSummary.tsx` — Resumen con subtotal, envío estimado, total
  - [ ] `CartDrawer.tsx` — Sheet/Drawer lateral con lista de items y botón checkout

- [ ] 4.3 Página del carrito
  - [ ] `src/routes/(authenticated)/cart.tsx` — Vista completa del carrito con resumen y botón de checkout

---

## Fase 5: Checkout y Pagos (Stripe)

> El usuario puede completar el checkout e ingresar datos de pago con Stripe.

- [ ] 5.1 Servicio de pagos
  - [ ] `src/services/payments.service.ts` — createPaymentIntent, confirmPayment
  - [ ] `src/services/orders.service.ts` — createOrder, getUserOrders, getOrderById

- [ ] 5.2 Configuración de Stripe
  - [ ] `src/config/stripe.config.ts` — loadStripe con publishable key

- [ ] 5.3 Componentes de checkout
  - [ ] `ShippingForm.tsx` — Formulario de dirección con react-hook-form + zod
  - [ ] `OrderSummary.tsx` — Resumen de la orden (items, totales)
  - [ ] `PaymentForm.tsx` — Stripe PaymentElement con confirmación
  - [ ] `CheckoutForm.tsx` — Orquestador: shipping → resumen → pago

- [ ] 5.4 Páginas
  - [ ] `src/routes/(authenticated)/checkout.tsx` — Página de checkout con Steps
  - [ ] `src/routes/(authenticated)/orders/$orderId.success.tsx` — Confirmación de orden exitosa

---

## Fase 6: Pedidos del Usuario

> El usuario puede ver su historial de pedidos y el detalle de cada uno.

- [ ] 6.1 Hook de pedidos
  - [ ] `src/hooks/useOrders.ts` — Queries para listar y obtener pedidos

- [ ] 6.2 Componentes de pedidos
  - [ ] `OrderCard.tsx` — Card con número de orden, fecha, estado, total
  - [ ] `OrderStatusBadge.tsx` — Badge con color según estado
  - [ ] `OrderItemsList.tsx` — Lista de items de una orden
  - [ ] `OrderTracking.tsx` — Timeline visual del estado del pedido

- [ ] 6.3 Páginas
  - [ ] `src/routes/(authenticated)/orders/index.tsx` — Lista de pedidos del usuario
  - [ ] `src/routes/(authenticated)/orders/$orderId.tsx` — Detalle completo de un pedido

---

## Fase 7: Perfil y Diseños del Usuario

> El usuario puede gestionar su perfil y subir diseños.

- [ ] 7.1 Servicios
  - [ ] `src/services/upload.service.ts` — Upload de archivos a Supabase Storage
  - [ ] `src/services/designs.service.ts` — CRUD de diseños del usuario

- [ ] 7.2 Hooks
  - [ ] `src/hooks/useDesigns.ts` — Queries y mutations para diseños

- [ ] 7.3 Componentes
  - [ ] `DesignUploader.tsx` — Dropzone para subir diseños con preview
  - [ ] `DesignCard.tsx` — Card con preview, nombre, estado, acciones
  - [ ] `DesignGallery.tsx` — Grid de diseños del usuario
  - [ ] `DesignPreview.tsx` — Modal con vista ampliada del diseño

- [ ] 7.4 Páginas
  - [ ] `src/routes/(authenticated)/profile.tsx` — Perfil con datos editables
  - [ ] `src/routes/(authenticated)/designs.tsx` — Gestión de diseños (subir, ver, eliminar)

---

## Fase 8: Panel de Administración

> El admin puede gestionar pedidos, aprobar diseños y administrar campañas.

- [ ] 8.1 Servicios
  - [ ] `src/services/admin.service.ts` — Operaciones admin (listar todos los pedidos, actualizar estados, aprobar diseños, CRUD campañas)

- [ ] 8.2 Hook
  - [ ] `src/hooks/useAdmin.ts` — Queries y mutations para operaciones admin

- [ ] 8.3 Componentes admin
  - [ ] `OrdersTable.tsx` — Tabla con filtros, sorting y paginación
  - [ ] `OrderDetailModal.tsx` — Modal con detalle completo y acciones
  - [ ] `StatusUpdateForm.tsx` — Formulario para actualizar estado de pedido
  - [ ] `DesignApprovalCard.tsx` — Card para aprobar/rechazar diseños

- [ ] 8.4 Páginas admin
  - [ ] `src/routes/(admin)/dashboard.tsx` — Dashboard con métricas (pedidos, ingresos, diseños pendientes)
  - [ ] `src/routes/(admin)/orders-management.tsx` — Gestión de todos los pedidos
  - [ ] `src/routes/(admin)/designs-management.tsx` — Aprobación de diseños
  - [ ] `src/routes/(admin)/campaigns-management.tsx` — CRUD de campañas

---

## Fase 9: Polish y UX

> Pulir la experiencia de usuario con loading states, error handling, responsividad y accesibilidad.

- [ ] 9.1 Loading states
  - [ ] Skeletons en todas las páginas que cargan datos
  - [ ] Loading spinners en botones de acción (submit, pago)
  - [ ] Optimistic updates en carrito (agregar/eliminar)

- [ ] 9.2 Error handling
  - [ ] ErrorBoundary en rutas principales
  - [ ] Mensajes de error amigables en formularios
  - [ ] Retry automático en queries fallidas
  - [ ] Página 404 (NotFound)

- [ ] 9.3 Responsive design
  - [ ] Header con menú hamburguesa en mobile
  - [ ] Grids adaptativos (1 col mobile → 2 tablet → 3-4 desktop)
  - [ ] CartDrawer como Sheet en mobile
  - [ ] Tablas scrollables en mobile

- [ ] 9.4 Accesibilidad
  - [ ] Labels en todos los inputs
  - [ ] Roles ARIA en componentes interactivos
  - [ ] Focus management en modales y drawers
  - [ ] Contraste de colores adecuado
  - [ ] Navegación por teclado

- [ ] 9.5 Feedback al usuario
  - [ ] Toasts en todas las acciones (agregar al carrito, crear orden, errores)
  - [ ] Confirmación antes de acciones destructivas (eliminar, cancelar)
  - [ ] Indicadores de progreso en checkout

---

## Fase 10: Deployment

> Configurar y desplegar en Netlify con las variables de entorno correctas.

- [ ] 10.1 Configuración
  - [ ] Crear `netlify.toml` con build command, publish dir y redirects SPA
  - [ ] Configurar variables de entorno en Netlify dashboard
  - [ ] Verificar build de producción local (`yarn build && yarn preview`)

- [ ] 10.2 Despliegue
  - [ ] Conectar repositorio GitHub a Netlify
  - [ ] Configurar auto-deploy en push a main
  - [ ] Verificar que la app funciona en producción
  - [ ] Configurar dominio personalizado (opcional)

- [ ] 10.3 Post-deployment
  - [ ] Verificar Stripe en modo live
  - [ ] Verificar Supabase en producción
  - [ ] Monitorear errores en consola
  - [ ] Test end-to-end del flujo completo (registro → browse → cart → checkout → order)

---

## Alcance del MVP vs Futuro

| Feature                | MVP | Futuro                         |
| ---------------------- | --- | ------------------------------ |
| Registro/Login (email) | ✅  | OAuth (Google, GitHub)         |
| Browse campañas        | ✅  | Búsqueda avanzada, filtros     |
| Detalle de producto    | ✅  | Reviews, recomendaciones       |
| Carrito                | ✅  | Wishlist, guardar para después |
| Checkout con Stripe    | ✅  | Múltiples métodos de pago      |
| Historial de pedidos   | ✅  | Notificaciones por email       |
| Subir diseños          | ✅  | Editor de diseños in-app       |
| Panel admin básico     | ✅  | Analytics avanzados, reportes  |
| Responsive design      | ✅  | App nativa (React Native)      |
| Deploy Netlify         | ✅  | CI/CD, staging environments    |

---

## Orden de Implementación Recomendado

```
Fase 1 (Tipos + UI base)
  └─→ Fase 2 (Auth)
        └─→ Fase 3 (Catálogo)
              └─→ Fase 4 (Carrito)
                    └─→ Fase 5 (Checkout + Stripe)
                          └─→ Fase 6 (Pedidos)
                                └─→ Fase 7 (Perfil + Diseños)
                                      └─→ Fase 8 (Admin)
                                            └─→ Fase 9 (Polish)
                                                  └─→ Fase 10 (Deploy)
```

Cada fase es funcional y testeable de forma independiente. No avanzar a la siguiente hasta que la actual esté completa y verificada.
