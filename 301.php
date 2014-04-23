<?php
header('Status: 301 Moved Permanently', false, 301);
header('Location: '.strip_tags($_GET['url']));
?>
