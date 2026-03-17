// api/upload.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Méthode non autorisée');

    const { fileName, fileBase64 } = req.body;
    
    // C'est ici qu'on utilise la variable d'environnement cachée
    const GITHUB_TOKEN = process.env.GH_TOKEN; 
    const REPO_OWNER = "Pamplemouche-Tech";
    const REPO_NAME = "reserve-data";

    const path = `files/${Date.now()}_${fileName}`;

    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Upload de ${fileName}`,
            content: fileBase64
        })
    });

    const data = await response.json();
    if (response.ok) {
        res.status(200).json({ url: data.content.download_url });
    } else {
        res.status(500).json({ error: "Erreur GitHub" });
    }
}
