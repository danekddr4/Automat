<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $drink = $_POST["drink"];

    // Zde bys měl přidat spojení s Arduinem nebo ESP32 přes WiFi nebo sériovou komunikaci.
    // Například odeslat HTTP request nebo sériový signál.
    
    echo "Objednávka přijata: " . htmlspecialchars($drink);
} else {
    echo "Neplatný požadavek.";
}
?>
