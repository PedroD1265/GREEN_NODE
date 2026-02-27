# GREEN NODE — Guía de la Aplicación

**App de reciclaje inteligente para Cochabamba, Bolivia**  
Conecta generadores de residuos (hogares/comercios) con recolectores verificados.

---

## ¿Qué es GREEN NODE?

GREEN NODE es una app móvil DEMO que permite:
- **Identificar residuos** por foto usando IA (simulada)
- **Crear pedidos de recojo** de material reciclable (manual o guiado por IA)
- **Elegir recolector** según tarifas, rating y horarios
- **Seguir el caso** en tiempo real hasta completar con PIN de 4 dígitos
- **Ganar puntos o efectivo** por reciclar
- **Canjear recompensas** con los puntos acumulados

---

## Cómo correr la app

```bash
cd "green node v0 FIGMA"
npm install
npm run dev
```
Abrir http://localhost:5173 en el navegador.

---

## Dos modos de uso

### 🌿 Modo Usuario
Entrar como generador de residuos (hogar/comercio):

| Pantalla | Qué hace |
|---|---|
| **Home** | Ver puntos, nivel (Bronce/Plata/Oro), caso activo, acciones rápidas |
| **IA Hub** | Hablar con GREEN: crear pedido, identificar residuo, ver centros |
| **¿Se recicla?** | Tomar 4 fotos → IA identifica material, bucket, confianza, tips |
| **Crear Pedido (IA)** | Wizard conversacional: material → cantidad → fotos → horario → dirección |
| **Crear Pedido (Manual)** | Wizard de 5 pasos: material → cantidad → horario → incentivo → confirmar |
| **Incentivo** | Elegir: Efectivo (Bs al recoger) o Puntos (canjear en recompensas) |
| **Ofertas** | Ver 3 recolectores verificados con tarifas Bs/kg, elegir uno |
| **Auto-asignación** | IA asigna al recolector más eficiente (si eligió Puntos) |
| **Seguimiento** | Timeline: Pendiente → Aceptado → En camino → Completado |
| **PIN** | Mostrar PIN de 4 dígitos al recolector para cerrar el caso |
| **Recompensas** | Catálogo de 7 items, puntos necesarios, canjear (demo) |
| **Centros/Precios** | 3 tabs: Centros de acopio, Peligrosos, Tabla de precios |

### 🚛 Modo Recolector
Entrar como recolector verificado de materiales:

| Pantalla | Qué hace |
|---|---|
| **Onboarding** | Elegir tipo (Independiente/Empresa), llenar datos, verificación demo |
| **Dashboard** | Recojos hoy, pendientes, rating, ganancias, toggle auto-aceptar |
| **Solicitudes** | Lista de pedidos pendientes con filtros (cercano/valor/horario) |
| **Detalle** | Fotos, materiales, kg declarado vs IA, aceptar/rechazar |
| **Ruta** | Mapa mock con paradas, botón "Llegué" + ingresar PIN |
| **Confirmación** | Resumen + foto evidencia + completar caso |
| **Calificar** | Rating 1-5 estrellas + reportar problemas del usuario |
| **Perfil** | Verificado, materiales, tarifas, horarios, historial |

---

## Clasificación de residuos (5 buckets)

| Bucket | Emoji | Color | Ejemplos |
|---|---|---|---|
| Reciclable | ✅ | Verde | PET, cartón, vidrio, aluminio, acero |
| Biodegradable | 🌿 | Verde oscuro | Restos cocina, jardín |
| No aprovechable | 🗑️ | Gris | Envolturas, bolsas, Tetra Pak* |
| Peligroso | ⚠️ | Rojo | Pilas, electrónicos, medicamentos |
| Especial | 🧱 | Amarillo | Muebles, llantas, escombros |

*Tetra Pak es "no aprovechable" por defecto en Cochabamba (puede variar).

---

## Datos demo incluidos

- **3 recolectores**: Carlos M. (independiente), María R. (independiente), EcoCocha (empresa)
- **7 recompensas**: Recarga móvil, café, cupón, bolsa eco, compost, botella, crédito premium
- **6 casos** en diferentes estados (Pendiente, Aceptado, En camino, Completado)
- **15 materiales** mapeados a los 5 buckets con tips
- **3 centros de acopio** en Cochabamba

---

## Reglas de puntos

| Material | Puntos/kg |
|---|---|
| Aluminio | 5 |
| Vidrio | 3 |
| Acero/Chatarra | 3 |
| PET | 2 |
| Plástico rígido | 2 |
| Cartón | 1 |
| Papel | 1 |

- **Bonus +10%** si el material está limpio y separado
- **Penalización -5 pts** si el material declarado no coincide

---

## Seguridad

- Dirección exacta **protegida** hasta que se asigna un recolector verificado
- PIN de 4 dígitos para cerrar caso (usuario muestra al recolector)
- Sistema de reputación: Bronce → Plata → Oro
- Recolectores con baja confianza del usuario tienen opción de rechazar

---

## Stack tecnológico

React 18 + Vite 6 + Tailwind CSS 4 + React Router 7 + shadcn/ui + Lucide icons

---

*Todo en esta app es DEMO — datos ficticios, usuarios ficticios, pagos ficticios.*
