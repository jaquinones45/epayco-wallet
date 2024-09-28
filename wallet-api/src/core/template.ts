export const templateEmail = ({
  name,
  quantity,
  price,
  idSession,
  token,
}: {
  name: string;
  quantity: number;
  price: number;
  idSession: string;
  token: number;
}) => ({
  text: `
    Confirmación de compra\n
    Gracias por realizar tu compra en nuestra tienda.\n
    A continuación, se presentan los detalles de tu compra:\n
    Producto: ${name}\n
    Cantidad: ${quantity}\n
    Precio: ${price}\n
    Para verificar tu compra, por favor ingresa el siguiente código en el área de "Confirmar compra" en tu pagina:\n
    Id sesión: <b>${idSession}</b>\n
    Token: <b>${token}</b>\n
    Si tienes alguna pregunta o problema con tu compra, no dudes en contactarnos a través del formulario de contacto.\n
    Atentamente,\n
    Tu tienda en línea\n
  `,
  html: `
    <h1>Confirmación de compra</h1>
    <p>Gracias por realizar tu compra en nuestra tienda. A continuación, se presentan los detalles de tu compra:</p>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Precio</th>
      </tr>
      <tr>
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${price}</td>
      </tr>
    </table>

    <p>Para verificar tu compra, por favor ingresa el siguiente código en el área de "Confirmar compra" en tu pagina:</p>
    <p>Id sesión: ${idSession}</p>
    <p>Token: ${token}</p>

    <p>Si tienes alguna pregunta o problema con tu compra, no dudes en contactarnos a través del formulario de contacto.</p>

    <p>Atentamente,</p>
    <p>Tu tienda en línea</p>
  `,
});
