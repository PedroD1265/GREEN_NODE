# GREEN NODE — Progreso del Proyecto

**Última actualización:** 2026-02-27  
**Estado general:** ✅ ~90% completado (MVP Demo funcional)

---

## ✅ Funciona correctamente

### Modo Usuario (13 pantallas)
- [x] **U0 Mode Select** — Landing con 2 botones + instrucciones demo (usuario + recolector)
- [x] **U1 Home** — Puntos + nivel + acciones rápidas + caso activo + "Hablar con GREEN"
- [x] **U2 IA Hub** — 3 intents (crear pedido, se recicla, precios) + chips materiales
- [x] **U3 ¿Se recicla?** — Guía fotos 4 ángulos + tips + "Analizar con IA"
- [x] **U4 AI Result** — Material detectado + bucket + confianza + calidad + CTAs dinámicos
- [x] **U5 Create Case** — Wizard IA 6 pasos + **panel resumen sticky actualizado**
- [x] **U6 Incentivo** — Efectivo/Puntos con explicación y navegación correcta
- [x] **U7 Ofertas** — 3 recolectores con tarifas Bs/kg + AI Recomendado + **navega al caso creado**
- [x] **U7b Auto-assign** — IA asigna EcoCocha + "por qué" + **navega al caso creado**
- [x] **U8 Case Status** — Timeline stepper + collector info + mapa mock + Ver PIN
- [x] **U9 PIN + Rating** — PIN 4 dígitos + calificar recolector + **report issues** + **foto evidencia**
- [x] **U10 Recompensas** — 7 items + "te faltan X" + canjear + **reglas penalty/bonus visibles**
- [x] **U11 Centros** — 3 tabs (centros, peligrosos, precios) con data real Cochabamba
- [x] **U12 Manual Case** — 5 pasos + **incentivo inline** + **crea caso** + **navega al tracking**

### Modo Recolector (7 archivos, 10 pantallas lógicas)
- [x] **R1 Dashboard** — Stats + auto-aceptar toggle + CTAs
- [x] **R2 Elegir tipo** — Independiente / Empresa
- [x] **R3 Onboarding Independiente** — CI, selfie, tel, vehículo, placa, licencia, zona, materiales, horarios, tarifas
- [x] **R4 Onboarding Empresa** — Razón social, NIT, representante, conductores, vehículos
- [x] **R5 Solicitudes** — Lista con IA badge, user level, dirección, **sorting funcional**
- [x] **R6 Detalle** — Fotos gallery, kg IA vs declarado, accept/reject según confianza
- [x] **R7 Ruta** — Mapa mock + paradas + "En camino"/"Llegué"
- [x] **R8 Confirmación** — PIN input + foto evidencia + completar
- [x] **R9 Calificar** — Rating 1-5 + issues (material incorrecto/sucio/mezclado/cantidad falsa)
- [x] **R10 Perfil** — Verificado, materiales, tarifas, horarios, historial, reset demo

### Demo Data
- [x] 15 materiales → 5 buckets con tips
- [x] 3 recolectores (2 ind + 1 empresa) con tarifas Bs/kg
- [x] 7 recompensas coherentes con Cochabamba
- [x] 6 casos en 4 estados
- [x] 3 centros de acopio
- [x] Reglas de puntos (PET 2, vidrio 3, aluminio 5, cartón 1)
- [x] Penalty/bonus visible en UI

### Navegación / Flujos
- [x] Flow A (User AI): Landing → Home → AI → CreateCase → Incentive → Offers/AutoAssign → **CaseStatus**
- [x] Flow B (Identify): Home → AI → Photos → Result → CreateCase o Centers
- [x] Flow C (Manual): Home → ManualCase → **crea caso** → **CaseStatus** ← CORREGIDO
- [x] Flow D (Collector): Landing → Onboarding → Home → Requests → Detail → Route → Pickup → Profile
- [x] Bottom nav usuario: Inicio / IA / Casos / Recompensas
- [x] Bottom nav recolector: Inicio / Solicitudes / Ruta / Perfil

### Estilo / Design System
- [x] Paleta GREEN NODE (WCAG-friendly)
- [x] Font Inter cargada (Google Fonts)
- [x] Variables CSS GREEN NODE (--gn-*) sin romper shadcn
- [x] Componentes reutilizables (Button, Card, Badge, Chip, StatusBadge, TimelineStepper, BucketChip)
- [x] Iconos Lucide consistentes

---

## 🔧 Cambios aplicados en esta sesión (patch)

| # | Fix | Tipo | Archivo |
|---|---|---|---|
| P0-4 | `addCase` devuelve el ID del caso creado | Bloqueante | `AppContext.tsx` |
| P0-1 | ManualCase crea caso al enviar y navega al tracking | Bloqueante | `ManualCase.tsx` |
| P0-2 | CollectorOffers navega al caso recién creado | Bloqueante | `CollectorOffers.tsx` |
| P0-3 | AutoAssign navega al caso recién creado | Bloqueante | `AutoAssign.tsx` |
| P1-1 | Penalty/bonus visible en Recompensas | Importante | `Rewards.tsx` |
| P1-2 | Panel "Resumen del caso" sticky mejorado en CreateCase | Importante | `CreateCase.tsx` |
| P1-3 | Report issues en rating del usuario | Importante | `CaseStatus.tsx` |
| P1-4 | Foto evidencia placeholder en completado | Importante | `CaseStatus.tsx` |
| P1-5 | Landing con pasos demo recolector | Importante | `LandingPage.tsx` |
| P1-6 | Font Inter cargada | Importante | `index.html` |
| P1-7 | Variables CSS GREEN NODE | Importante | `theme.css` |
| P2-1 | Sorting funcional en solicitudes | Nice to have | `CollectorRequests.tsx` |

---

## ⚠️ Pendiente / Oportunidades de mejora

### Funcional (bajo impacto para demo)
- [ ] **Foto capture real**: Los placeholders de fotos no simulan estados OK/Retomar con interacción
- [ ] **Página 40_Demo-Data visual**: Datos demo solo existen en código; no hay pantalla para verlos como tablas
- [ ] **Chat real con IA**: El wizard de CreateCase simula chat pero no tiene respuestas dinámicas
- [ ] **Max-width 390px global**: Solo algunos footers tienen constraint de iPhone; el layout podría beneficiarse

### Estilo (polish)
- [ ] Colores inline aún no usan las CSS variables `--gn-*` (migración gradual, no urgente)
- [ ] Dark mode no implementado (requerimiento dice "Light mode only for MVP" ✅)

### Datos
- [ ] Penalty/bonus: lógica real de cálculo no implementada (solo info visual ✅)
- [ ] Solo 2 casos pertenecen a `user-me`; podrían agregarse más para mejor demo
- [ ] Rating del usuario no persiste ni afecta reputación real (es DEMO)

---

## 📊 Compilación

```
vite v6.3.5 building for production...
✓ 1633 modules transformed
✓ 0 errors
✓ built in 3.46s

dist/index.html         0.70 kB
dist/assets/index.css  110.09 kB
dist/assets/index.js   343.52 kB
```

---

*Este archivo se actualiza conforme avanza el desarrollo. Última verificación: build exitoso 2026-02-27.*
