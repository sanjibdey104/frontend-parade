function Star(el, count, callback) {
  let activeRating = 0;
  let starsContainer = document.querySelector(".stars");
  let tempFragment = document.createDocumentFragment();
  let emojis = ["😑", "😐", "🙂", "😃", "😍"];

  for (let i = 1; i <= count; i++) {
    let star = document.createElement("i");
    star.classList.add("far");
    star.classList.add("fa-star");
    star.dataset.ratingValue = i;
    star.dataset.emoji = emojis[i - 1];
    tempFragment.appendChild(star);
  }
  starsContainer.appendChild(tempFragment);
  starsContainer.addEventListener("mouseover", highlightStars);
  starsContainer.addEventListener("mouseleave", preserveRating);
  starsContainer.addEventListener("click", updateRating);

  function highlightStars(e) {
    let targetRating = e.target.dataset.ratingValue;
    if (targetRating) {
      fillTheStars(targetRating);
    }
    return;
  }

  function preserveRating(e) {
    fillTheStars(activeRating);
  }

  function updateRating(e) {
    let targetRating = e.target.dataset.ratingValue;
    if (targetRating) {
      activeRating = targetRating;
      fillTheStars(targetRating);
      callback(targetRating, e.target.dataset.emoji);
    } else return;
  }

  function fillTheStars(targetRating) {
    for (let i = 0; i < count; i++) {
      if (i < targetRating) {
        starsContainer.children[i].classList.replace("far", "fas");
      } else starsContainer.children[i].classList.replace("fas", "far");
    }
  }
}

function getRating(value, emoji) {
  let ratingDisplayEl = document.querySelector(".rating-value");
  ratingDisplayEl.innerHTML = `<p>${value}</p><p>${emoji}</p>`;
}

Star(".stars", 5, getRating);
