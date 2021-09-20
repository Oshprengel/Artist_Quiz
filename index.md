<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script defer src="./JS/script.js"></script>
    <link rel="stylesheet" href="./CSS/style.css"></link>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300&display=swap" rel="stylesheet">
    <title>Artist Quiz</title>
</head>
<body>
    <header>
        <h1 id="head">Artist Quiz</h1>
        <h4>How much do you know about your favorite artist?</h4>
        <input id="searchBar"type="text"></input>
        <button id="submitArtist">Submit Artist</button>
    </header>
    <div id = "answers">
    <h3 id="question"></h3>
        <input type="radio" id="check0"><label for="check0" id = "answer0"></label><br>
        <input type="radio" id="check1"><label for="check1" id = "answer1"></label><br>
        <input type="radio" id="check2"><label for="check2" id = "answer2"></label><br>
        <input type="radio" id="check3"><label for="check3" id = "answer3"></label><br>
        <button id = "submitAnswer">submit</button>
    </div>
    <footer id = "Results">

    </footer>
</body>
</html>
