<?php

    // Import PHPMailer classes into the global namespace 
    use PHPMailer\PHPMailer\PHPMailer; 
    use PHPMailer\PHPMailer\SMTP; 
    use PHPMailer\PHPMailer\Exception; 

    // Include library files 
    require 'PHPMailer/Exception.php'; 
    require 'PHPMailer/PHPMailer.php'; 
    require 'PHPMailer/SMTP.php'; 

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $address = $_POST['address'];
        $subject = $_POST['subject'];
        
        // Create an instance; Pass `true` to enable exceptions 
        $mail = new PHPMailer; 
        
        // Server settings 
        //$mail->SMTPDebug = SMTP::DEBUG_SERVER;    //Enable verbose debug output 
        $mail->isSMTP();                            // Set mailer to use SMTP 
        $mail->Host = 'smtp.example.com';           // Specify main and backup SMTP servers 
        $mail->SMTPAuth = true;                     // Enable SMTP authentication 
        $mail->Username = 'user@example.com';       // SMTP username 
        $mail->Password = 'email_password';         // SMTP password 
        $mail->SMTPSecure = 'ssl';                  // Enable TLS encryption, `ssl` also accepted 
        $mail->Port = 465;                          // TCP port to connect to 
        
        // Sender info 
        $mail->setFrom('danyal.akhtar@torontomu.ca', 'Danyal Akhtar'); 
        $mail->addReplyTo('danyal.akhtar@torontomu.ca', 'Danyal Akhtar'); 
        
        // Add a recipient 
        $mail->addAddress($address); 
        
        //$mail->addCC('cc@example.com'); 
        //$mail->addBCC('bcc@example.com'); 
        
        // Set email format to HTML 
        $mail->isHTML(true); 
        
        // Mail subject 
        $mail->Subject = $subject; 
        
        // Mail body content 
        $bodyContent = '<h1>It works, I love copy pasting code/h1>'; 
        $bodyContent .= '<p>This HTML email is sent from the localhost server using PHP by <b>Danyal Akhtar definitely did not copy anything</b></p>'; 
        $mail->Body    = $bodyContent; 
        
        // Send email 
        if(!$mail->send()) { 
            echo 'Message could not be sent. Mailer Error: '.$mail->ErrorInfo; 
        } else { 
            echo 'Message has been sent.'; 
        }
    }
?>