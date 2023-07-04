var currentSlideIndex = 0;
    var slides = document.getElementsByClassName('slide');
    var previousButton = document.getElementById('previousButton');
    var nextButton = document.getElementById('nextButton');
    var slidesContainer = document.getElementById('slidesContainer');
    var player;

    function showSlide(index) {
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
      }
      slides[index].style.display = 'grid';

      previousButton.disabled = index === 0;
      nextButton.disabled = index === slides.length - 1;

      if (player && player.stopVideo) {
        player.stopVideo();
      }
    }

    function nextSlide() {
      if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
      }
    }

    function previousSlide() {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
      }
    }

    function createYouTubePlayer(videoId) {
      player = new YT.Player('youtubePlayer', {
        height: '315',
        width: '560',
        videoId: videoId,
      });
    }

    fetch('experience.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Het is niet gelukt de JSON data op te halen');
        }
        return response.json();
      })
      .then(data => {

        for (var i = 0; i < data.length; i++) {
          var slide = data[i];

          var slideElement = document.createElement('article');
          slideElement.className = 'slide';

          if (slide.left) {
            var leftElement = document.createElement('p');
            leftElement.id = 'Linksdeelding'; 
            for (var j = 0; j < slide.left.length; j++) {
              var leftText = document.createTextNode(slide.left[j]);
              leftElement.appendChild(leftText);
              leftElement.appendChild(document.createElement('br'));
            }
            slideElement.appendChild(leftElement);
          }
          

          if (slide.video) {
            if (slide.video.includes('youtube.com')) {
              var videoId = extractYouTubeVideoId(slide.video);
              var youtubePlayerElement = document.createElement('div');
              youtubePlayerElement.id = 'youtubePlayer';
              slideElement.appendChild(youtubePlayerElement);
              createYouTubePlayer(videoId);
            } else {
              var videoElement = document.createElement('img');
              videoElement.id = 'viddeel'; 
              videoElement.src = slide.video;
              videoElement.width = '560';
              videoElement.height = '315';
              slideElement.appendChild(videoElement);
            }
          }

          if (slide.right) {
            var rightElement = document.createElement('p');
            rightElement.id = 'Rechtsdeelding'; 
            for (var k = 0; k < slide.right.length; k++) {
              var rightText = document.createTextNode(slide.right[k]);
              rightElement.appendChild(rightText);
              rightElement.appendChild(document.createElement('br'));
            }
            slideElement.appendChild(rightElement);
          }

          slidesContainer.appendChild(slideElement);
        }

        showSlide(currentSlideIndex);
      })
      .catch(error => {
        console.error(error);
      });

    nextButton.addEventListener('click', nextSlide);
    previousButton.addEventListener('click', previousSlide);

    function extractYouTubeVideoId(url) {
      var match = url.match(/youtube\.com.*(\?v=|\/embed\/|\/\d\/|\/vi\/|\/v\/|https:\/\/www\.youtube\.com\/watch\?v=)([^#\&\?]*).*/);
      return match && match[2].length === 11 ? match[2] : null;
    }