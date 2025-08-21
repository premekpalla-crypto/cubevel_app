const sgMail = require("@sendgrid/mail");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Ladicí výpis
    console.log("📨 Přijatá data:", data);

    // Ověření vstupů
    if (!data.email || !data.name || !data.message) {
      console.error("❌ Chybí povinné údaje");
      return {
        statusCode: 400,
        body: "Missing required fields"
      };
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: "info@cubevel.cz",               // kam e‑mail dorazí
      from: "info@cubevel.cz",             // ověřený odesílatel
      replyTo: data.email,                 // zákazníkova adresa
      subject: data.subject || "Nová modlitba",
      text: `${data.message}\n\nOd: ${data.name} <${data.email}>`,
      html: `
        <p>${data.message}</p>
        <hr>
        <p><strong>Od:</strong> ${data.name} &lt;${data.email}&gt;</p>
      `
    };

    const [response] = await sgMail.send(msg);
    console.log("📬 SendGrid odpověď:", response.statusCode);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, status: response.statusCode })
    };
  } catch (error) {
    console.error("❌ Chyba při odesílání:", error.response?.body || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
