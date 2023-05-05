const apiKey = '';


async function getRandomJoke() {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?lang=fr');

    if (response.ok) {
        const data = await response.json();
        if (data.type === 'single') {
            return data.joke;
        } else {
            return `${data.setup} ${data.delivery}`;
        }
    }

    return "Désolé, nous n'avons pas pu obtenir une blague.";
}

async function askChatGPT(question) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: question }
                ],
                max_tokens: 50,
                n: 1,
                temperature: 0.5,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        if (response.data.choices && response.data.choices.length > 0) {
            const chatMessage = response.data.choices[0].message;
            return chatMessage.content.trim();
        } else {
            return "Désolé, je n'ai pas pu trouver de réponse à votre question.";
        }
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API ChatGPT:', error);
        return "Désolé, une erreur s'est produite lors de l'appel à l'API.";
    }
}

async function getCountryCapital(countryName) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

    if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
            return `La capitale de ${data[0].name.common} est ${data[0].capital[0]}.`;
        }
    }

    return `Désolé, nous n'avons pas pu trouver d'informations sur ${countryName}.`;
}

async function translateText(text, targetLanguage = 'en') {
    const sourceLanguage = 'fr';
    const encodedText = encodeURIComponent(text);
    const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLanguage}|${targetLanguage}`
    );

    if (response.ok) {
        const data = await response.json();
        return data.responseData.translatedText;
    }

    return null;
}

export { getRandomJoke, askChatGPT, getCountryCapital, translateText };
