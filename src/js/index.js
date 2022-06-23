import '../css/style.css';
import axios from 'axios';

//Defining variables
const newStories = 'https://hacker-news.firebaseio.com/v0/newstories.json';

const storyItem = 'https://hacker-news.firebaseio.com/v0/item/';

const wrapper = document.getElementById('wrapper');

const loadBtn = document.getElementById('more');

let idNews = [];

let currentNewsId = 0;

let news = [];

//Fetching first 10 news and getting IDs

FetchingNews();
async function FetchingNews() {
    idNews = await fetchData(newStories);
    await getStories();
    showNews();

    document.querySelector(".loader").style.display = "none"; //Showing loader when updating news
}

async function fetchData(url) {
    const res = await axios.get(url);
    return res.data;
}

// Loop for to show 10 IDs more & event listener

async function getStories() {
    news = [];
    loadBtn.innerHTML = "Load More";
    loadBtn.removeEventListener('click', showNews);
    for (let i = 0; i < 10; i++) {
        news.push(await fetchData(`${storyItem + idNews[currentNewsId++]}.json`));
    }
    loadBtn.innerHTML = 'Load More';
    loadBtn.addEventListener('click', showNews);
}

//Mapping news and convert Unix time

function showNews() {
    currentNewsId -= 10;
    news.map(story => {

        const date = new Date(story.time * 1000);

        const hours = date.getHours();

        const minutes = date.getMinutes();

        const time = `${getDigits(hours)}:${getDigits(minutes)}`;

        const year = date.getFullYear();

        const month = getDigits(date.toLocaleString('en-us', { month: 'long' }));

        const day = getDigits(date.getDate());

        const dateTime = `${day} ${month} ${year} at ${time}`;
        function getDigits(num) {
            return num.toString().padStart(2, '0');
        }

        //Defining article template
        wrapper.innerHTML +=
            '<article class="story">' +
            '<h2>' +
            story.title +
            '</h2>' +
            '<p class="author"> ' +
            'Author: ' +
            story.by +
            '</p>' +
            '<p class="date">' +
            'Date: ' +
            (dateTime) +
            '</p>' +
            '<a href="' + story.url + '">' +
            '<button class="button"> Read More </button>' +
            '</article>';
    })
    getStories();
}

// Enable Dark&Light Mode

const toggle = document.getElementById('toggle');

const body = document.body;

toggle.addEventListener('input', e => {
  const isChecked = e.target.checked;

  if (isChecked) {
    body.classList.add('dark-theme');
  } else {
    body.classList.remove('dark-theme');
  }
});