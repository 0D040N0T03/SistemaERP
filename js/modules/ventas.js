import { actionButtons, appendRows, badge, cell, clear, el, row } from "../app.js";
import { format, SalesService } from "../services.js";

export function init(root, section) {
  renderOrders(root);
  renderCustomers(root);
  renderTickets(root);
  renderPayments(root);
  if (section === "pedidos") bindOrderDetails(root);
}

function renderOrders(root) {
  const target = root.querySelector("#ordersTable");
  if (!target) return;
  appendRows(target, SalesService.getPedidos().map((pedido) => {
    const tr = row(
      cell(`#${pedido.idPedido}`),
      cell(pedido.fecha),
      cell(pedido.cliente.nombre),
      cell(pedido.cliente.telefono || "-"),
      cell(pedido.usuario.empleado.nombre),
      cell(badge(pedido.estado, format.badge(pedido.estado))),
      cell(format.money(pedido.boleta?.subtotal || 0)),
      cell(format.money(pedido.boleta?.total || 0)),
      cell(actionButtons({ includeDetalle: true, includeAnular: pedido.estado !== "Anulado" }))
    );
    tr.dataset.order = pedido.idPedido;
    return tr;
  }));
}

function bindOrderDetails(root) {
  const detail = root.querySelector("#orderDetail");
  root.querySelectorAll(".js-detail").forEach((button) => {
    button.addEventListener("click", () => {
      const idPedido = Number(button.closest("tr").dataset.order);
      const pedido = SalesService.getPedidos().find((item) => item.idPedido === idPedido);
      detail.classList.remove("hidden");
      clear(detail);
      const list = el("ul", { className: "detail-list" });
      list.append(...pedido.detalles.map((item) => {
        const li = el("li", {},
          el("strong", { text: item.producto.nombre }),
          ` x ${item.cantidad} - ${format.money(item.subtotal)}`
        );
        if (item.observacion) li.append(" ", el("span", { className: "muted", text: `(${item.observacion})` }));
        return li;
      }));
      detail.append(
        el("div", { className: "section-heading" },
          el("h2", { text: `Detalle pedido #${pedido.idPedido}` }),
          badge(pedido.estado, format.badge(pedido.estado))
        ),
        list,
        el("p", { className: "muted", text: `Descuentos por producto incluidos. IGV fijo 18%. Metodo: ${pedido.boleta ? pedido.boleta.idMetodoPago : "-"}` })
      );
    });
  });
}

function renderCustomers(root) {
  const target = root.querySelector("#customersTable");
  if (!target) return;
  appendRows(target, SalesService.getClientes().map((item) => row(
    cell(item.idCliente),
    cell(item.nombre),
    cell(item.telefono || "-"),
    cell(item.pedidos),
    cell(actionButtons())
  )));
}

function renderTickets(root) {
  const target = root.querySelector("#ticketsTable");
  if (!target) return;
  appendRows(target, SalesService.getBoletas().map((item) => row(
    cell(item.numeroBoleta),
    cell(`#${item.idPedido}`),
    cell(item.metodo.descripcion),
    cell(format.money(item.subtotal)),
    cell(format.money(item.igv)),
    cell(format.money(item.total))
  )));
}

function renderPayments(root) {
  const target = root.querySelector("#paymentsTable");
  if (!target) return;
  appendRows(target, SalesService.getMetodosPago().map((item) => {
    const status = item.activo ? "Activo" : "Inactivo";
    return row(
      cell(item.idMetodoPago),
      cell(item.descripcion),
      cell(badge(status, format.badge(status))),
      cell(actionButtons())
    );
  }));
}
