var ctx = new (window.AudioContext || window.webkitAudioContext)();
var convolver = ctx.createConvolver();
convolver.connect(ctx.destination);

var sw;
var pusher;
var preach;


function stop() 
{
  if (pusher) {
    pusher.disconnect();
    pusher = null;
  }
}

function setNewValues()
{
	
	var voice=(!localStorage["voice"])? "m6":localStorage["voice"];
	var pitch=(!localStorage["pitch"])? 50:parseInt(localStorage["pitch"]);
	var rate=(!localStorage["rate"])? 175:parseInt(localStorage["rate"]);
	
  	sw.setVoice("ka+"+voice);
  	sw.set_rate(rate);
  	sw.set_pitch(pitch);
	
}


function speak(sentence)
{

  stop();
  setNewValues();
  var samples_queue = [];
  var now = Date.now();

  pusher = new PushAudioNode(ctx);

  if (preach)
    pusher.connect(convolver);
  else
    pusher.connect(ctx.destination);

  sw.synth(sentence,
    function(samples, events) {
      if (!samples) {
        pusher.close();
        return;
      }
      pusher.push(new Float32Array(samples));
      
      if (now) {
        now = 0;
      }
    });
}




sw = new Espeak('js/sw.worker.js', function cb() 
{
       
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/church-schellingwoude.ogg', true);
        xhr.responseType = 'arraybuffer';

        function convolverLoadFail(e) {
         console.log("Error with decoding audio data" , e);
         document.getElementById('preachit').disabled = true;
         document.body.classList.remove('loading');
        }

        xhr.onerror = convolverLoadFail;

        xhr.onload = function() {
          var audioData = xhr.response;
          ctx.decodeAudioData(audioData, function(buffer) {
            convolver.buffer = buffer;
            document.body.classList.remove('loading');
			
          }, convolverLoadFail);
        }
        xhr.send();
});




var tts_menu_play = chrome.contextMenus.create({title: "Play", contexts:["selection"], onclick: function(info, tab) {
    speak(info.selectionText);
}});
var tts_menu_stop = chrome.contextMenus.create({title: "Stop", contexts:["selection"], onclick: function(info, tab) {
    stop();
}});

var tts_menu_separator = chrome.contextMenus.create({type: "separator", contexts:["selection"]});
var tts_menu_options = chrome.contextMenus.create({title: "Options", contexts:["selection"], onclick: function(info, tab) {
    chrome.tabs.create({url: "options.html"});
}});
