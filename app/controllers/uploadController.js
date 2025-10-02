// URL pública de tu backend en Render
const BASE_URL = process.env.BACKEND_URL || 'https://mdbackend-ys7z.onrender.com';

exports.subirArchivos = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No se subieron archivos' });
    }

    console.log('Archivos recibidos:', req.files);

    const archivos = req.files.map(file => ({
        filename: file.filename,
        url: `${BASE_URL}/uploads/${encodeURIComponent(file.filename)}`
    }));

    res.json({
        message: 'Archivos subidos correctamente',
        archivos
    });
};
