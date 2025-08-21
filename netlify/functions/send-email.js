const sgMail = require("@sendgrid/mail");

// Načtení API klíče z prostředí Netlify
const apiKey = process.env.SENDGRID_API_KEY;
console.log("🔑 API klíč:", apiKey ? "NALEZEN" : "CHYBÍ");

sgMail.setApiKey(apiKey);

exports.handler = async (event) => {
  console.log("✅ Funkce byla spuštěna");

  try {
    const data = JSON.parse(event.body || "{}");
    console.log("📨 Přijatá data:", data);

    if (!data.to || !data.subject || !data.message) {
      console.warn("⚠️ Chybí některé pole");
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          success: false,
          error: "Chybí pole: to, subject nebo message"
        })
      };
    }

    console.log("📦 Sestavuji zprávu...");
    const msg = {
      to: "info@cubevel.cz",
      from: "info@cubevel.cz",
      subject: data.subject,
      text: data.message,
      html: `<p>${data.message}</p>`
    };

    console.log("📤 Odesílám e‑mail...");
    const [response] = await sgMail.send(msg);

    console.log("📬 SendGrid odpověď:", {
      statusCode: response.statusCode,
      headers: response.headers
    });

    if (response.statusCode !== 202) {
      throw new Error("SendGrid nevrátil potvrzení o přijetí e‑mailu.");
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        success: true,
        message: "E‑mail byl úspěšně odeslán."
      })
    };
  } catch (error) {
    console.error("❌ Chyba při odesílání:", error.response?.body || error.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        success: false,
        error: error.response?.body?.errors?.[0]?.message || error.message || "Neznámá chyba"
      })
    };
  }
};
