// $.ajaxSetup({
//   beforeSend: function(request) {
//     request.setRequestHeader("Music Quiz 1.0","Email: oshprengel@gmail.com");
//   }
// });
$.ajax({
    url: `https://musicbrainz.org/ws/2/artist?query=%22all%20star%22&fmt=json`
  }).then(
    (data) => {
      console.log(data.artists[0]);
    },
    (error) => {
      console.log("Oops something went wrong: ", error);
    }
  );