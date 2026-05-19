// src/lib/i18n.ts
// Traducciones ES/EN + tipos para el sistema de internacionalizacion

export type Lang = "es" | "en";

const es = {
  saveAndContinue: "Guardar y continuar",
  saving:          "Guardando...",
  test:            "Probar conexion",
  testing:         "Probando...",
  testSuccess:     "Conexion exitosa",
  testFail:        "Error de conexion",
  skip:            "Saltear por ahora",
  login:           "Iniciar sesion",
  signup:          "Crear cuenta",
  logout:          "Cerrar sesion",
  email:           "Email",
  password:        "Contrasena",
  save:            "Guardar",
  cancel:          "Cancelar",
  delete:          "Eliminar",
  edit:            "Editar",
  close:           "Cerrar",
  loading:         "Cargando...",
  error:           "Error",
  success:         "Exito",
  newLead:         "Nuevo lead",
  pipeline:        "Pipeline",
  inbox:           "Inbox",
  dashboard:       "Dashboard",
  settings:        "Ajustes",
  upgrade:         "Mejorar plan",
  currentPlan:     "Plan actual",
  monthly:         "Mensual",
  annual:          "Anual",
};

const en: typeof es = {
  saveAndContinue: "Save and continue",
  saving:          "Saving...",
  test:            "Test connection",
  testing:         "Testing...",
  testSuccess:     "Connection successful",
  testFail:        "Connection error",
  skip:            "Skip for now",
  login:           "Sign in",
  signup:          "Create account",
  logout:          "Sign out",
  email:           "Email",
  password:        "Password",
  save:            "Save",
  cancel:          "Cancel",
  delete:          "Delete",
  edit:            "Edit",
  close:           "Close",
  loading:         "Loading...",
  error:           "Error",
  success:         "Success",
  newLead:         "New lead",
  pipeline:        "Pipeline",
  inbox:           "Inbox",
  dashboard:       "Dashboard",
  settings:        "Settings",
  upgrade:         "Upgrade plan",
  currentPlan:     "Current plan",
  monthly:         "Monthly",
  annual:          "Annual",
};

export const translations: Record<Lang, typeof es> = { es, en };

export const COPY = translations;

export type Translations = typeof es;
