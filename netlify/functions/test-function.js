exports.handler = async (event) => {
  console.log("✅ Testovací funkce byla spuštěna");
  console.log("📨 Metoda:", event.httpMethod);
  console.log("📦 Tělo požadavku:", event.body);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      success: true,
      message: "Funkce funguje správně!"
    })
  };
};

