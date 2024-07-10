

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const { imageUrl } = await request.json();
    const prompt = "eres un experto diseñador y quiero que me des feedback sobre esta página web";

    console.log('Received request with imageUrl:', imageUrl);

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-proj-7gRkJkANwVACgX0nBDMFT3BlbkFJthC1MgR4NW2CcwySE9nu`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  "url": imageUrl,
                },
              },
            ],
          },
        ],
      })
    });

    const result = await openaiResponse.json();
    console.log('Received response from OpenAI:', result);

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Permitir todas las solicitudes de origen
        'Access-Control-Allow-Methods': 'POST', // Permitir solo el método POST
        'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Permitir encabezados específicos
      }
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Permitir todas las solicitudes de origen
        'Access-Control-Allow-Methods': 'POST', // Permitir solo el método POST
        'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Permitir encabezados específicos
      },
      status: 500
    });
  }
}
