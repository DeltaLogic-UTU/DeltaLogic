<?php
header('Content-Type: application/json');

// Lee el contenido JSON enviado desde el cliente.
$input = file_get_contents('php://input');
if (!$input) {
    echo json_encode(['status' => 'error', 'message' => 'No se recibió ningún contenido.']);
    exit;
}

$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['status' => 'error', 'message' => 'JSON inválido.']);
    exit;
}

// Campos obligatorios.
$requiredFields = ['nombre', 'pais', 'email', 'telefono', 'consulta'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        echo json_encode(['status' => 'error', 'message' => "Falta el campo $field."]);
        exit;
    }
}

// Validar teléfono: solo dígitos y exactamente 9 caracteres.
$telefono = preg_replace('/\D/', '', $data['telefono']);
if (strlen($telefono) !== 9) {
    echo json_encode(['status' => 'error', 'message' => 'El teléfono debe contener exactamente 9 números.']);
    exit;
}
$data['telefono'] = $telefono;

// Archivo donde se guardan todas las consultas.
$filePath = __DIR__ . DIRECTORY_SEPARATOR . 'consultas.txt';
$existingData = [];
if (file_exists($filePath)) {
    $content = file_get_contents($filePath);
    if (!empty(trim($content))) {
        $existingData = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $existingData = [];
        }
    }
}

// Agrega la nueva consulta al array existente.
$existingData[] = $data;

// Guarda el archivo en formato JSON.
if (file_put_contents($filePath, json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo escribir en el archivo.']);
    exit;
}

echo json_encode(['status' => 'success']);
