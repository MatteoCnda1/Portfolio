<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(substr($_POST['name'], 0, 100));
    $email = htmlspecialchars(substr($_POST['email'], 0, 100));
    $message = htmlspecialchars(substr($_POST['message'], 0, 2000));
    
    $to = "m.canada13960@gmail.com, matteo.canada@etu.univ-amu.fr";
    $subject = "Nouveau message depuis ton portfolio";
    
    $body = "Nouveau message reçu\n\n";
    $body .= "Nom: $name\n";
    $body .= "Email: $email\n\n";
    $body .= "Message:\n$message";
    
    $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    if (mail($to, $subject, $body, $headers)) {
        header("Location: ../merci.html");
        exit;
    } else {
        echo "Erreur lors de l'envoi";
    }
} else {
    echo "Accès interdit";
}
?>