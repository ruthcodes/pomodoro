$(document).ready(function(){
  //slider text (e.g. 13)
  var timeSliderNum;
  var breakSliderNum;
  //current countdown timer (e.g. 13:00)
  var currentTimer;
  var breakTimer;
  // booleans for counting/pausing, both false to start
  var paused;
  var counting;
  //set interval that calls the countdown function
  var mySetInt;
  //set timeout to start the timer
  var timer;
  //number of minutes remaining in countdown
  var minutes;
  //state checker, alternates to "break"
  var swapping = "work";

  var bar = new ProgressBar.Circle(cont, {
    color: '#a6a6a6',
    strokeWidth: 4,
    trailWidth: 4,
    easing: 'linear',
    duration: 1400,
    text: {
      autoStyleContainer: false
    },
    from: { color: '#00FF00', width: 4 },
    to: { color: '#00FF00', width: 4 },
    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
      circle.setText("Click me!");
    }
  });
  bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  bar.text.style.fontSize = '1rem';


  //code when clicking the circle
  $('#cont').on("click touchstart",function (event){
    bar.text.style.fontSize = '2rem';

    // this function stops the countdown function
    function stopIt(){
      counting = false;
      if (swapping == "work"){
        swapping = "break";
        $("#breakSliderValue").css("font-size", "30px");
        $("#timeSliderValue").css("font-size", "20px");
      } else {
        swapping = "work";
        $("#breakSliderValue").css("font-size", "20px");
        $("#timeSliderValue").css("font-size", "30px");
      }
      clearInterval(mySetInt);
    }
    // this is the countdown timer, increments seconds, then calls stopIt
    function countdown(){
      counting = true;
      //update text on screen
      if (swapping == "work"){
        $('#timeSliderValue').html(currentTimer);
        var str = currentTimer.split('');
      } else {
        $('#breakSliderValue').html(breakTimer);
        var str = breakTimer.split('');
      }


      var curSec = str[str.length-2] + str[str.length-1];
      curSec = parseInt(curSec);
      // stop when reach 0:00
      if (str[0] == "0" && curSec == "01"){



        //this code sets the clock back to the slider number when it finishes and switches to the other colour
        function wait(){
          timeSliderNum = $( "p.time" ).text();
          breakSliderNum = $( "p.break" ).text(); 
          currentTimer = timeSliderNum + ":00";
          breakTimer = breakSliderNum + ":00";

          $('#timeSliderValue').html(currentTimer);
          $('#breakSliderValue').html(breakTimer);
          stopIt();
        }
        setTimeout(wait, 900);

      }
      //when there are minutes left
      if (str[0] >= "0"){
        //if there are seconds left
        if (curSec > 0){
          curSec -=1;
          //this makes sure there are always 2 places even when less than 10 (so 09, instead of 9)
          if (curSec < 10){
            var zero = "0";
            curSec = zero.concat(curSec);
          }
          // if number of minutes is less than 10 (a single number)
          if (str[1] == ":"){
            breakTimer = str[0] + ":" + curSec;
            currentTimer = str[0] + ":" + curSec;
            return str[0] + ":" + curSec;
          } else {
            minutes = str[0].concat(str[1]);
            breakTimer = minutes + ":" + curSec;
            currentTimer = minutes + ":" + curSec;
            return minutes + ":" + curSec;
          }
        } else {
          //when there are no seconds left (and there are still minutes)
          if (str[1] == ":"){
            var replace = str[0] - 1;
          } else{
            minutes = str[0].concat(str[1]);
            var replace = minutes - 1;
          }

          curSec = 59;
          currentTimer = replace + ":" + curSec;
          breakTimer = replace + ":" + curSec;
          return replace + ":" + curSec;
        }
      }
      // reaches here when minutes and seconds on timer is less than 0 
      stopIt();
    }

    function alternating(whichTimer, interval){

      // code for after pause
      if (paused && counting){
        //currentTimer is the centre clock
        currentTimer = $( "#timeSliderValue" ).text();
        breakTimer = $( "#breakSliderValue" ).text();

        if(!whichTimer){
          if (swapping == "work"){
            whichTimer = currentTimer;
          } else {
            whichTimer = breakTimer;
          }   
        }

        var str = whichTimer.split('');
        // taking minutes (covers 2 places or 1 e.g. 1:00 or 10:00)
        if (str.length == 4){
          var minutes = str[0];
        } else {
          var minutes = str[0] + str[1];
        }
        //converts minutes into seconds an adds to the seconds already calculated, uses that number to run progress bar
        var secs = str[str.length-2] + str[str.length-1];
        minutes = parseInt(minutes) * 60;
        secs = parseInt(secs) + minutes;
        //this stops the interval from defaulting back to the start number so will still trigger the next loop once this one finishes
        interval = secs * 1000;

        //when continuing bar animation after pause, run for remaining amount of seconds
        if (swapping == "work"){
          bar.animate(1, {
            duration: secs*1000,
            step: function(state, circle) {
              circle.setText("Work!");
            }
          });
        } else {
          bar.animate(0,  {
            duration: secs*1000,
            step: function(state, circle) {
              circle.path.setAttribute('stroke', "#ff0000");
              circle.path.setAttribute('stroke-width', 4);
              circle.setText("Break!");
            }

          }); 
        }
        //call countdown every second, to simulate the timer counting down by seconds
        mySetInt = setInterval(countdown, 1000, whichTimer = countdown(whichTimer));
      } else {
        // if you havent paused and click circle, animate the bar and call the countdown function in setInterval
        //if no interval (first time it runs), set the interval to the 'working' timer length

        function loop(){

          if (swapping == "work"){
            bar.animate(1,  {
              duration: timeSliderNum*60000,
              step: function(state, circle) {
                circle.path.setAttribute('stroke', '#00FF00');
                circle.path.setAttribute('stroke-width', 4);
                circle.setText("Work!");
              }
            }); 
          } else {
            bar.animate(0,  {
              duration: breakSliderNum*60000,
              step: function(state, circle) {
                circle.path.setAttribute('stroke', "#ff0000");
                circle.path.setAttribute('stroke-width', 4);
                circle.setText("Break!");
              }
            }); 
          }
        }

        // this prevents the timer running multiple times - will only run if currently not running a timer.
        if (!counting){

          // numbers below sliders
          timeSliderNum = $( "p.time" ).text();
          breakSliderNum = $( "p.break" ).text(); 
          // turning slider numbers into centre clock
          currentTimer = timeSliderNum + ":00";
          breakTimer = breakSliderNum + ":00";

          if(!whichTimer){
            whichTimer = currentTimer;
          }

          mySetInt = setInterval(countdown, 1000, whichTimer = countdown(whichTimer));
          //loop animates the bar
          loop();
        };
      }

      function swap(){

        if (swapping == "break") {
          alternating(breakTimer, breakSliderNum*60000);
        } else {
          alternating(currentTimer, timeSliderNum*60000);
        }
      }

      paused = false;
      if (interval === undefined){
        interval = timeSliderNum*60000;
      } 
      console.log("starting a timer with this interval: " + interval);


      timer = setTimeout(swap, interval);

    }

    if (!counting || paused){
      alternating();
    } 

  });

  $('#pause').on('click', function(event){
    paused = true;
    bar.stop();
    clearInterval(mySetInt);
    clearTimeout(timer);
  })

  $('#stop').on('click', function(event){
    paused = false;
    swapping = "work";
    bar.set(0);
    counting = false;
    currentTimer = $( "#timeSliderVal" ).text() + ":00";
    breakTimer = $( "#breakSliderVal" ).text() + ":00";

    $('#timeSliderValue').html(currentTimer);
    $('#breakSliderValue').html(breakTimer);
    $("#breakSliderValue").css("font-size", "20px");
    $("#timeSliderValue").css("font-size", "30px");
    bar.text.style.fontSize = '1rem';

    clearInterval(mySetInt);
    clearTimeout(timer);
  })

  //slider code  
  $('.slider').each(function (){
    var output = document.getElementById(this.id.concat("Val"));
    output.innerHTML = this.value;

    this.oninput = function() {
      output.innerHTML = this.value;

      // change the centre clocks based on sliders
      // only change when coutdown isn't happening
      if (!counting){
        var toChange = "#" + this.id + "Value";
        $(toChange).html(this.value + ":00");
      }
    }
  });
});
