import { setupUserBox } from "./app.js";

setupUserBox("Administrador");

const content = document.querySelector("#content");
const title = document.querySelector("#viewTitle");
const navItems = document.querySelectorAll(".nav-item");

const moduleLoaders = {
  dashboard: () => import("./modules/dashboard.js"),
  ventas: () => import("./modules/ventas.js"),
  catalogo: () => import("./modules/catalogo.js"),
  inventario: () => import("./modules/inventario.js"),
  personas: () => import("./modules/personas.js"),
  reportes: () => import("./modules/reportes.js")
};

const titles = {
  dashboard: "Dashboard",
  pedidos: "Pedidos",
  clientes: "Clientes",
  boletas: "Boletas",
  "metodos-pago": "Metodos de pago",
  productos: "Productos",
  categorias: "Categorias",
  recetas: "Recetas",
  promociones: "Promociones",
  combos: "Combos",
  insumos: "Insumos",
  medidas: "Unidades de medida",
  compras: "Compras",
  movimientos: "Movimientos",
  kardex: "Kardex",
  empleados: "Empleados",
  usuarios: "Usuarios",
  roles: "Roles",
  proveedores: "Proveedores",
  ventas: "Reportes de ventas",
  inventario: "Movimientos de inventario",
  anulados: "Pedidos anulados"
};

async function loadPage(page, section) {
  const response = await fetch(`pages/${page}.html`);
  content.innerHTML = await response.text();

  content.querySelectorAll(".admin-section").forEach((node) => {
    node.classList.toggle("active", node.id === section);
  });

  const module = await moduleLoaders[page]();
  module.init(content, section);
  title.textContent = titles[section] || titles[page] || "ERP";
  content.focus();
}

navItems.forEach((button) => {
  button.addEventListener("click", () => {
    navItems.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    loadPage(button.dataset.page, button.dataset.section);
  });
});

loadPage("dashboard", "dashboard");
