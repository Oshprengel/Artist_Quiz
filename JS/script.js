////////////////////////////////////////////////////////////////Global Event Handlers/////////////////////////////////////////////////////////////////////////////////
//Handles an artist submission
$("#submitArtist").on('click', playQuiz);

////////////////////////////////////////////////////////////////Global Event Functions////////////////////////////////////////////////////////////////////////////////

//Asks multiple questions about the artist within the text input at the time the function is called
function playQuiz(){
  ////////////////variables for artists data and players current score///////////////
  userInput = $("#searchBar").val()
  artistType = null;
  artistOrigin = null;
  artistStart = null;
  artistRelease = null;
  playerScore = 0;
  gameOver = false;
  artistName = null;
  ///////////////////Ajax call which assigns artist data to its proper variables///////////////////
  //formats the user input into the proper format
  userInput = userInput.replace(" ", "%20")
  //retrieves artist ID then assigns it to artistID
  artistID = null;
  $.ajax({
    url: `https://musicbrainz.org/ws/2/artist/?query=${userInput}&fmt=json`,
  }).then(
    (data) => {
      artistID = data.artists[0].id
      //once artist ID is aquired  we make another ajax call using the artist ID to assign all the artist variables
      $.ajax({
        url: `https://musicbrainz.org/ws/2/artist/${artistID}?fmt=json&inc=releases`,}).then(function (idData){
        artistType = idData.type
        artistOrigin = idData['begin-area'].name
        artistStartYr = parseInt(idData['life-span'].begin.substr(0,4))
        artistRelease = idData.releases[Math.floor(.99 + Math.random() * idData.releases.length)].title
        artistName = idData.name
        askQuestion(0)
        })
      }),
    (error) => {
      console.log("cannot retrieve artist ID: ", error);
    }
  ;
  
  ///////////////////functions neccesary for playing the quiz///////////////////
  function askQuestion(questionNo){
    //Creates a list of questions for a band 
    const questionsBand = [
      `When was ${artistName} formed?`,
      `Where was ${artistName} formed?`,
      `Which one of these releases is from ${artistName}`
    ]
    //creates a list of questions for a person
    const questionsPerson = [];
    questionsBand.forEach((currstring)=>{
      questionsPerson.push(currstring.replace("formed","born")
    )})
    //asks a question(which question is asked is dependent on the questionNo var and the artistType)
    if(questionNo === 0){
      console.log(artistStartYr)
      if (artistType === "Person"){
        $("#question").html(questionsPerson[0])
        appendAnswers(generateDates(artistStartYr,3),artistStartYr)
      }
      else{
        $("#question").html(questionsBand[0])
        appendAnswers(generateDates(artistStartYr,3),artistStartYr)
      }
    }
    if(questionNo ===1){
      if (artistType === "Person"){
        $("#question").html(questionsPerson[1])
        appendAnswers(generateLocations(),generateLocations(),generateLocations(),artistOrigin)
      }
      else{
        $("#question").html(questionsBand[1])
        appendAnswers(generateLocations(),generateLocations(),generateLocations(),artistOrigin)
      }
    }
    if(questionNo ===2){
      if (artistType === "Person"){
        $("#question").html(questionsPerson[2])
        appendAnswers(generateAlbums(),generateAlbums(),generateAlbums(),artistRelease)
      }
      else{
        $("#question").html(questionsBand[2])
        appendAnswers(generateAlbums(),generateAlbums(),generateAlbums(),artistRelease)
      }
    }
    if(questionNo ===3){
      displayResults(3,playerScore)
    } 
  };
  //displays the users score using the playerScore var and the declares that the game is oever, takes in the total number of questions as param 1 and total right as param 2
  function displayResults(noQuestions, NoRight){

  };
  //this function appends 4 answers to the h3 elements in the html in random order the correct answer being the fourth input param 
  function appendAnswers(answers,realAnswer){
    console.log(answers, realAnswer)

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
  function generateAlbums(numAlbums, avoidAlbum){
  const returnAlbums = []
  const albums = ["The Piper at the Gates of Dawn","A Saucerful of Secrets","More","Ummagumma","Atom Heart Mother","Meddle","Obscured by Clouds","The Dark Side of the Moon","Wish You Were Here","Animals","The Final Cut","Eagles","Desperado","Hotel California","The Long Run","Hell Freezes Over","Hybrid Theory","Meteora","Minutes to Midnight","A Thousand Suns","Living Things","Indicud","Satellite Flight: The Journey to Mother Moon","Speedin' Bullet 2 Heaven","Passion, Pain & Demon Slayin","Man on the Moon III: The Chosen","Day 'n' Nite","Pursuit of Happiness"]
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
  
  function generateLocations(numLocations){
    //an array of major cities in the US
    const locations = [];
    const cityNames = ["Aberdeen", "Abilene", "Akron", "Albany", "Albuquerque", "Alexandria", "Allentown", "Amarillo", "Anaheim", "Anchorage", "Ann Arbor", "Antioch", "Apple Valley", "Appleton", "Arlington", "Arvada", "Asheville", "Athens", "Atlanta", "Atlantic City", "Augusta", "Aurora", "Austin", "Bakersfield", "Baltimore", "Barnstable", "Baton Rouge", "Beaumont", "Bel Air", "Bellevue", "Berkeley", "Bethlehem", "Billings", "Birmingham", "Bloomington", "Boise", "Boise City", "Bonita Springs", "Boston", "Boulder", "Bradenton", "Bremerton", "Bridgeport", "Brighton", "Brownsville", "Bryan", "Buffalo", "Burbank", "Burlington", "Cambridge", "Canton", "Cape Coral", "Carrollton", "Cary", "Cathedral City", "Cedar Rapids", "Champaign", "Chandler", "Charleston", "Charlotte", "Chattanooga", "Chesapeake", "Chicago", "Chula Vista", "Cincinnati", "Clarke County", "Clarksville", "Clearwater", "Cleveland", "College Station", "Colorado Springs", "Columbia", "Columbus", "Concord", "Coral Springs", "Corona", "Corpus Christi", "Costa Mesa", "Dallas", "Daly City", "Danbury", "Davenport", "Davidson County", "Dayton", "Daytona Beach", "Deltona", "Denton", "Denver", "Des Moines", "Detroit", "Downey", "Duluth", "Durham", "El Monte", "El Paso", "Elizabeth", "Elk Grove", "Elkhart", "Erie", "Escondido", "Eugene", "Evansville", "Fairfield", "Fargo", "Fayetteville", "Fitchburg", "Flint", "Fontana", "Fort Collins", "Fort Lauderdale", "Fort Smith", "Fort Walton Beach", "Fort Wayne", "Fort Worth", "Frederick", "Fremont", "Fresno", "Fullerton", "Gainesville", "Garden Grove", "Garland", "Gastonia", "Gilbert", "Glendale", "Grand Prairie", "Grand Rapids", "Grayslake", "Green Bay", "GreenBay", "Greensboro", "Greenville", "Gulfport-Biloxi", "Hagerstown", "Hampton", "Harlingen", "Harrisburg", "Hartford", "Havre de Grace", "Hayward", "Hemet", "Henderson", "Hesperia", "Hialeah", "Hickory", "High Point", "Hollywood", "Honolulu", "Houma", "Houston", "Howell", "Huntington", "Huntington Beach", "Huntsville", "Independence", "Indianapolis", "Inglewood", "Irvine", "Irving", "Jackson", "Jacksonville", "Jefferson", "Jersey City", "Johnson City", "Joliet", "Kailua", "Kalamazoo", "Kaneohe", "Kansas City", "Kennewick", "Kenosha", "Killeen", "Kissimmee", "Knoxville", "Lacey", "Lafayette", "Lake Charles", "Lakeland", "Lakewood", "Lancaster", "Lansing", "Laredo", "Las Cruces", "Las Vegas", "Layton", "Leominster", "Lewisville", "Lexington", "Lincoln", "Little Rock", "Long Beach", "Lorain", "Los Angeles", "Louisville", "Lowell", "Lubbock", "Macon", "Madison", "Manchester", "Marina", "Marysville", "McAllen", "McHenry", "Medford", "Melbourne", "Memphis", "Merced", "Mesa", "Mesquite", "Miami", "Milwaukee", "Minneapolis", "Miramar", "Mission Viejo", "Mobile", "Modesto", "Monroe", "Monterey", "Montgomery", "Moreno Valley", "Murfreesboro", "Murrieta", "Muskegon", "Myrtle Beach", "Naperville", "Naples", "Nashua", "Nashville", "New Bedford", "New Haven", "New London", "New Orleans", "New York", "New York City", "Newark", "Newburgh", "Newport News", "Norfolk", "Normal", "Norman", "North Charleston", "North Las Vegas", "North Port", "Norwalk", "Norwich", "Oakland", "Ocala", "Oceanside", "Odessa", "Ogden", "Oklahoma City", "Olathe", "Olympia", "Omaha", "Ontario", "Orange", "Orem", "Orlando", "Overland Park", "Oxnard", "Palm Bay", "Palm Springs", "Palmdale", "Panama City", "Pasadena", "Paterson", "Pembroke Pines", "Pensacola", "Peoria", "Philadelphia", "Phoenix", "Pittsburgh", "Plano", "Pomona", "Pompano Beach", "Port Arthur", "Port Orange", "Port Saint Lucie", "Port St. Lucie", "Portland", "Portsmouth", "Poughkeepsie", "Providence", "Provo", "Pueblo", "Punta Gorda", "Racine", "Raleigh", "Rancho Cucamonga", "Reading", "Redding", "Reno", "Richland", "Richmond", "Richmond County", "Riverside", "Roanoke", "Rochester", "Rockford", "Roseville", "Round Lake Beach", "Sacramento", "Saginaw", "Saint Louis", "Saint Paul", "Saint Petersburg", "Salem", "Salinas", "Salt Lake City", "San Antonio", "San Bernardino", "San Buenaventura", "San Diego", "San Francisco", "San Jose", "Santa Ana", "Santa Barbara", "Santa Clara", "Santa Clarita", "Santa Cruz", "Santa Maria", "Santa Rosa", "Sarasota", "Savannah", "Scottsdale", "Scranton", "Seaside", "Seattle", "Sebastian", "Shreveport", "Simi Valley", "Sioux City", "Sioux Falls", "South Bend", "South Lyon", "Spartanburg", "Spokane", "Springdale", "Springfield", "St. Louis", "St. Paul", "St. Petersburg", "Stamford", "Sterling Heights", "Stockton", "Sunnyvale", "Syracuse", "Tacoma", "Tallahassee", "Tampa", "Temecula", "Tempe", "Thornton", "Thousand Oaks", "Toledo", "Topeka", "Torrance", "Trenton", "Tucson", "Tulsa", "Tuscaloosa", "Tyler", "Utica", "Vallejo", "Vancouver", "Vero Beach", "Victorville", "Virginia Beach", "Visalia", "Waco", "Warren", "Washington", "Waterbury", "Waterloo", "West Covina", "West Valley City", "Westminster", "Wichita", "Wilmington", "Winston", "Winter Haven", "Worcester", "Yakima", "Yonkers", "York", "Youngstown"];
    for(let i = 0; i<numLocations;i++){
      locations.push(cityNames[Math.floor(Math.random() * cityNames.length)]) 
    }
    return locations
  }

  //displays the first question then creates an event listener for the submit button within answers div 
  $("#submitAnswer").on("click", ()=>{
    askQuestion()
  })
} 