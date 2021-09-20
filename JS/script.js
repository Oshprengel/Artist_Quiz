////////////////////////////////////////////////////////////////Global Event Handlers/////////////////////////////////////////////////////////////////////////////////
//global userinput variable
var userInput = null;
var artistData = null;
var artistID = null;
//Handles an artist submission
$("#submitArtist").on('click', qSearch);
function qSearch(){
  //variables that represent the users search query and the artists id if the call is made succcesfully 
  userInput = $("#searchBar").val()
  //formats the user input into the proper format
  userInput = userInput.replaceAll(" ", "%20")

  $.ajax({
    url: `https://musicbrainz.org/ws/2/artist/?query=${userInput}&fmt=json`,
    error: ()=>{alert("Please enter an artist")}
  }).then(
    (data)=>{
      //if an artist is successfully acquired then set the artist id to the id acquired by the search and run the playquiz function
      if(data.artists[0]){
        artistID = data.artists[0].id
        artistData = data;
        playQuiz()
      }
      //otherwise alert the user that their entry is not valid
      else{
        alert("Invalid entry")
      }
    }
  )
}

//Asks multiple questions about the artist within the text input at the time the function is called
function playQuiz(){
  ////////////////event handler for clicks within the answers div///////////////
  $("#answers").on('click',(evt)=>{
  switch(evt.target.nodeName){
    case "INPUT":
        currUserAnswer = evt.target
        Array.from($("#answers input")).forEach((currEle)=>{
        if (currEle != evt.target){
        $(currEle).prop("checked", false)
        }
      })
      break;
    case "BUTTON":
      takeScore(questionNo)
      askQuestion(questionNo)
    }
  })
//if a new artist is submitted mid quiz then then playerscore is set to null if the search query is valid
$("#submitArtist").on('click', ()=>{
  userInput = $("#searchBar").val()
  $.ajax({
    url: `https://musicbrainz.org/ws/2/artist/?query=${userInput}&fmt=json`,
  }).then((data)=>{
    if(data.artists[0]){
      questionNo = null;
      $("#Results").html("")
    }
  })
})
  ////////////////variables for artists data and players current score///////////////
  var artistOrigin = null;
  var artistRelease = null;
  var artistStartYr = null;
  var artistType = null;
  var playerScore = 0;
  var questionNo = 0;
  var currUserAnswer = null;
  var artistName = null;
  var numQuestions = null;
  var questions = [];
  var resultEle = [];
  var questionsAsked = null;
    
  ///////////////////Ajax call which assigns artist data to its proper variables///////////////////
      //once artist ID is aquired  we make another ajax call using the artist ID to assign all the artist variables
      $.ajax({
        url: `https://musicbrainz.org/ws/2/artist/${artistID}?fmt=json&inc=releases`,
      })
        .then(function (idData){
        
        artistType = idData.type ? idData.type : "Sorry we dont have enough info on this artist"
        //assigns variables only if they are availble from the api
        artistOrigin = idData['begin-area'] ? idData['begin-area'].name : null
        artistStartYr = idData['life-span'].begin ? parseInt(idData['life-span'].begin.substr(0,4)): null
        artistRelease = idData.releases.length > 1 ?idData.releases[Math.floor(.99 + Math.random() * idData.releases.length)].title : null
        //if no info on artist is availble then break function
        if (!artistOrigin && !artistStartYr && !artistRelease){
          alert("Sorry we dont have enough info on this artist") 
          return null}
        artistName = idData.name
        askQuestion(0)
        })


  
  ///////////////////functions neccesary for playing the quiz///////////////////
  function askQuestion(whichQuestion){
    
    //Creates a list of questions
    questions = [
      `When was ${artistName} ${artistType === 'Person' ? 'born' : 'formed'}?`,
      `Where was ${artistName} ${artistType === 'Person' ? 'born' : 'formed'}?`,
      `Which one of these releases is from ${artistName}`
    ]
    //random index var to be used for splicing answers into array
    let randomIndex = 0;
    //makes the questions visible
    $("#answers").css("display","block")
    //asks a question(which question is asked is dependent on the questionNo var)
    switch(whichQuestion) {
      case 0:
        //the if and else case handles scenerious where certain info on the artis might not be avaible, in that scenerio it cuts to the next question
        if(artistStartYr){
        //append the question to html
        $("#question").html(questions[0])
        //generate an array of random dates then splice the correct answer into the array
        const dates = generateDates(artistStartYr,3)
        randomIndex = Math.floor(Math.random() * (dates.length + 1))
        dates.splice(randomIndex,0,artistStartYr)
        appendAnswers(dates)
        numQuestions += 1
        break;
        }
        else{
          questionNo =questionNo +  1
          askQuestion(questionNo)
          break;
        }

      case 1:
        if(artistOrigin){
        $("#question").html(questions[1])
        const places = generateLocations(artistOrigin,3)
        randomIndex = Math.floor(Math.random() * (places.length + 1))
        places.splice(randomIndex,0,artistOrigin)
        appendAnswers(places)
        numQuestions += 1
        
        break;
        }
        else{
          questionNo =questionNo +  1
          askQuestion(questionNo)
          break;
        }
      case 2:
        if(artistRelease){
        $("#question").html(questions[2])
        const albums = generateAlbums(artistRelease,3)
        randomIndex = Math.floor(Math.random() * (albums.length + 1))
        albums.splice(randomIndex,0,artistRelease)
        appendAnswers(albums)
        numQuestions += 1
        break;
        }
        else{
          questionNo = questionNo + 1
          askQuestion(questionNo)
          break;
        }
      case 3:
        displayResults(numQuestions,playerScore)
    }
  };
  //displays the users score using the playerScore var and the declares that the game is oever, takes in the total number of questions as param 1 and total right as param 2
  function displayResults(noQuestions, NoRight){
    $("#answers").css("display","none")
    $("#Results").append(`<p>Results<br>${Math.floor(NoRight/noQuestions*100)}% correct<p> `)
    resultEle.reverse().forEach((currEle)=>{
      console.log(currEle)
      $("#Results").append(currEle)
    }) 
    questionNo = null;
  };
  //this function appends 4 answers to the h3 elements in the html in random order the correct answer being the fourth input param and also increases question no by 1 
  function appendAnswers(answers){
    answers.forEach((answer, indx)=>{
      $(`#answer${indx}`).html(answer)
    })
    questionNo = questionNo + 1;
  }
  //this function takes in the question that you are currently on and sees whether the checkbox filled correlates with the correct answer for that question, if it does then it adds one to the score
  function takeScore(questionNo){
    //represents the checkbox which the user has just checked
    let currCheckbox = $(currUserAnswer).attr("id")
    //if the label associated with the checkbox the user has checked is the correct answer for the question defined by each case paramter then add 1 to the users score
    switch(questionNo){
      case 1:
      if($(`label[for=${currCheckbox}]`).html() == artistStartYr){
        playerScore += 1
        //if questions are correct then the proper html element gets appended to the body otherwise the else statment is hit and the proper html statement gets appended
        resultEle.unshift($(`<p class = correct> Question ${numQuestions}: Correct <br> The Question: ${questions[0]}<br>Your Answer: ${$(`label[for=${currCheckbox}]`).html()}</p><br>`))
      }
      else{
        resultEle.unshift($(`<p class = inCorrect> Question ${numQuestions}: Incorrect <br> The Question: ${questions[0]}<br>Your Answer: ${$(`label[for=${currCheckbox}]`).html()}<br>Correct answer: ${artistStartYr}</p><br>`))
      }
      break;
      case 2:
      if($(`label[for=${currCheckbox}]`).html() == artistOrigin){
        playerScore += 1
        resultEle.unshift($(`<p class = correct> Question ${numQuestions}: Correct <br> The Question: ${questions[1]}<br>Your Answer: ${$(`label[for=${currCheckbox}]`).html()}</p><br>`))
      }
      else{
        resultEle.unshift($(`<p class = inCorrect> Question ${numQuestions}: Incorrect <br> The Question: ${questions[1]}<br>Your Answer: ${$(`label[for=${currCheckbox}]`).html()}<br>Correct answer: ${artistOrigin}</p><br>`))
      }
      break;
      case 3:
      if($(`label[for=${currCheckbox}]`).html() == artistRelease){
        playerScore += 1
        resultEle.unshift($(`<p class = correct> Question ${numQuestions}: Correct <br> The Question: ${questions[2]}<br>Your Answer: ${$(`label[for=${currCheckbox}]`).html()}</p><br>`))
      }
      else{
        resultEle.unshift($(`<p class = inCorrect> Question ${numQuestions}: Incorrect <br> The Question: ${questions[2]}<br>Your Answer: ${$(`label[for=${currCheckbox}]`).html()}<br>Correct answer: ${artistRelease}</p><br>`))
      }
      break;
    }
  }
  //function generates an array of years within 10 years of but not including the date param, the length of the array is determined by numdates
  function generateDates(date, numDates){
    const dates = []
    generatedDate = date-10 + Math.floor(Math.floor(Math.random()* 20 + 1));
    for (let i=1;i<=numDates;i++){
      //generates a number within 10 years then pushes it to the dates array if the added number is not already in the array and is not the originial date value
      while (generatedDate === date || dates.includes(generatedDate)){ 
      generatedDate = date-10 + Math.floor(Math.floor(Math.random()* 20 + 1))
      }
      dates.push(generatedDate)
    }
    return dates
  }
  //function generates a array of random albums, length is determined by the numAlbums input, album to avoid placing in array is specefied by the avoid album param
  function generateAlbums(avoidAlbum,numAlbums){
  const returnAlbums = []
  const albums = ["Close Encounters", "Creativity Lost", "Dopplebangers", "Quantum Crunk Theory", "Brilliant God Nothing Space","The Villian's Journey", "Bad Cartoons", "A Hole In The Fourth Walls", "Broken Thought", "Laid To Rest", "My Curse", "Antimacy","Anger","The Faded Line","Lamb Of God","Senseless War", "Sauce", "Big Ups", "Ivory","An Album Name", "Oleg's App", "2020","Run It","Hello World","JavaScript Hard"]
  let i = 0
  while (i < numAlbums){
    let randomAlbum = albums[Math.floor(Math.random() * albums.length)]
    if (avoidAlbum != randomAlbum && !returnAlbums.includes(randomAlbum)){
      returnAlbums.push(randomAlbum)
      i+=1
    }
  }
  return returnAlbums
}
  //function generates a array of random locations, length is determined by the numLocations input
  
  function generateLocations(avoidLocation,numLocations){
    //an array of major cities in the US
    const locations = [];
    const cityNames = ["Aberdeen", "Abilene", "Akron", "Albany", "Albuquerque", "Alexandria", "Allentown", "Amarillo", "Anaheim", "Anchorage", "Ann Arbor", "Antioch", "Apple Valley", "Appleton", "Arlington", "Arvada", "Asheville", "Athens", "Atlanta", "Atlantic City", "Augusta", "Aurora", "Austin", "Bakersfield", "Baltimore", "Barnstable", "Baton Rouge", "Beaumont", "Bel Air", "Bellevue", "Berkeley", "Bethlehem", "Billings", "Birmingham", "Bloomington", "Boise", "Boise City", "Bonita Springs", "Boston", "Boulder", "Bradenton", "Bremerton", "Bridgeport", "Brighton", "Brownsville", "Bryan", "Buffalo", "Burbank", "Burlington", "Cambridge", "Canton", "Cape Coral", "Carrollton", "Cary", "Cathedral City", "Cedar Rapids", "Champaign", "Chandler", "Charleston", "Charlotte", "Chattanooga", "Chesapeake", "Chicago", "Chula Vista", "Cincinnati", "Clarke County", "Clarksville", "Clearwater", "Cleveland", "College Station", "Colorado Springs", "Columbia", "Columbus", "Concord", "Coral Springs", "Corona", "Corpus Christi", "Costa Mesa", "Dallas", "Daly City", "Danbury", "Davenport", "Davidson County", "Dayton", "Daytona Beach", "Deltona", "Denton", "Denver", "Des Moines", "Detroit", "Downey", "Duluth", "Durham", "El Monte", "El Paso", "Elizabeth", "Elk Grove", "Elkhart", "Erie", "Escondido", "Eugene", "Evansville", "Fairfield", "Fargo", "Fayetteville", "Fitchburg", "Flint", "Fontana", "Fort Collins", "Fort Lauderdale", "Fort Smith", "Fort Walton Beach", "Fort Wayne", "Fort Worth", "Frederick", "Fremont", "Fresno", "Fullerton", "Gainesville", "Garden Grove", "Garland", "Gastonia", "Gilbert", "Glendale", "Grand Prairie", "Grand Rapids", "Grayslake", "Green Bay", "GreenBay", "Greensboro", "Greenville", "Gulfport-Biloxi", "Hagerstown", "Hampton", "Harlingen", "Harrisburg", "Hartford", "Havre de Grace", "Hayward", "Hemet", "Henderson", "Hesperia", "Hialeah", "Hickory", "High Point", "Hollywood", "Honolulu", "Houma", "Houston", "Howell", "Huntington", "Huntington Beach", "Huntsville", "Independence", "Indianapolis", "Inglewood", "Irvine", "Irving", "Jackson", "Jacksonville", "Jefferson", "Jersey City", "Johnson City", "Joliet", "Kailua", "Kalamazoo", "Kaneohe", "Kansas City", "Kennewick", "Kenosha", "Killeen", "Kissimmee", "Knoxville", "Lacey", "Lafayette", "Lake Charles", "Lakeland", "Lakewood", "Lancaster", "Lansing", "Laredo", "Las Cruces", "Las Vegas", "Layton", "Leominster", "Lewisville", "Lexington", "Lincoln", "Little Rock", "Long Beach", "Lorain", "Los Angeles", "Louisville", "Lowell", "Lubbock", "Macon", "Madison", "Manchester", "Marina", "Marysville", "McAllen", "McHenry", "Medford", "Melbourne", "Memphis", "Merced", "Mesa", "Mesquite", "Miami", "Milwaukee", "Minneapolis", "Miramar", "Mission Viejo", "Mobile", "Modesto", "Monroe", "Monterey", "Montgomery", "Moreno Valley", "Murfreesboro", "Murrieta", "Muskegon", "Myrtle Beach", "Naperville", "Naples", "Nashua", "Nashville", "New Bedford", "New Haven", "New London", "New Orleans", "New York", "New York City", "Newark", "Newburgh", "Newport News", "Norfolk", "Normal", "Norman", "North Charleston", "North Las Vegas", "North Port", "Norwalk", "Norwich", "Oakland", "Ocala", "Oceanside", "Odessa", "Ogden", "Oklahoma City", "Olathe", "Olympia", "Omaha", "Ontario", "Orange", "Orem", "Orlando", "Overland Park", "Oxnard", "Palm Bay", "Palm Springs", "Palmdale", "Panama City", "Pasadena", "Paterson", "Pembroke Pines", "Pensacola", "Peoria", "Philadelphia", "Phoenix", "Pittsburgh", "Plano", "Pomona", "Pompano Beach", "Port Arthur", "Port Orange", "Port Saint Lucie", "Port St. Lucie", "Portland", "Portsmouth", "Poughkeepsie", "Providence", "Provo", "Pueblo", "Punta Gorda", "Racine", "Raleigh", "Rancho Cucamonga", "Reading", "Redding", "Reno", "Richland", "Richmond", "Richmond County", "Riverside", "Roanoke", "Rochester", "Rockford", "Roseville", "Round Lake Beach", "Sacramento", "Saginaw", "Saint Louis", "Saint Paul", "Saint Petersburg", "Salem", "Salinas", "Salt Lake City", "San Antonio", "San Bernardino", "San Buenaventura", "San Diego", "San Francisco", "San Jose", "Santa Ana", "Santa Barbara", "Santa Clara", "Santa Clarita", "Santa Cruz", "Santa Maria", "Santa Rosa", "Sarasota", "Savannah", "Scottsdale", "Scranton", "Seaside", "Seattle", "Sebastian", "Shreveport", "Simi Valley", "Sioux City", "Sioux Falls", "South Bend", "South Lyon", "Spartanburg", "Spokane", "Springdale", "Springfield", "St. Louis", "St. Paul", "St. Petersburg", "Stamford", "Sterling Heights", "Stockton", "Sunnyvale", "Syracuse", "Tacoma", "Tallahassee", "Tampa", "Temecula", "Tempe", "Thornton", "Thousand Oaks", "Toledo", "Topeka", "Torrance", "Trenton", "Tucson", "Tulsa", "Tuscaloosa", "Tyler", "Utica", "Vallejo", "Vancouver", "Vero Beach", "Victorville", "Virginia Beach", "Visalia", "Waco", "Warren", "Washington", "Waterbury", "Waterloo", "West Covina", "West Valley City", "Westminster", "Wichita", "Wilmington", "Winston", "Winter Haven", "Worcester", "Yakima", "Yonkers", "York", "Youngstown"];
    let i = 0;
    while(i<numLocations){
      let location = cityNames[Math.floor(Math.random() * cityNames.length)]
      if (location != avoidLocation){
        locations.push(location)
        i++
      } 
    }
    return locations
  }
} 