const category = document.getElementById("category");
const posts = document.getElementById("posts-section");
const dis_total_posts = document.getElementById("total_posts");
const dis_category = document.getElementById("category_name");
const trending_btn = document.getElementById("trending_btn");
const todays_pick_btn = document.getElementById("todays_pick_btn");
const sort_of_view_section = document.getElementById("sort_of_view_section");


var current_category = "01";
var isTodaysPic = false;
var isTrending = false;
var sort_of_view = "default";

fetch("https://openapi.programming-hero.com/api/news/categories")
  .then(data => data.json())
  .then(data => {
    make_category(data.data.news_category);
  })
  .catch(err => console.log(err));
  

function get_posts_data() {
  fetch(`https://openapi.programming-hero.com/api/news/category/${current_category}`)
    .then(data => data.json())
    .then(data => {
      make_post(data.data);
    })
    .catch(err => console.log(err));
}

function change_category(category_id, category_name) {
  current_category = category_id;
  dis_category.innerText = category_name;
  get_posts_data();
}

trending_btn.addEventListener("click", function() {
  isTrending = !isTrending;
  if(isTrending) {
    trending_btn.classList.remove("text-violet-600");
    trending_btn.classList.add("bg-violet-500", "text-white");
  } else {
    trending_btn.classList.remove("bg-violet-500", "text-white");
    trending_btn.classList.add("text-violet-600");
  }
  get_posts_data();
});

todays_pick_btn.addEventListener("click", function() {
  isTodaysPic = !isTodaysPic;
  if(isTodaysPic) {
    todays_pick_btn.classList.remove("text-violet-600");
    todays_pick_btn.classList.add("bg-violet-500", "text-white");
  } else {
    todays_pick_btn.classList.remove("bg-violet-500", "text-white");
    todays_pick_btn.classList.add("text-violet-600");
  }
  get_posts_data();
});

sort_of_view_section.addEventListener("change", function(e) {
  sort_of_view = e.target.value;
  get_posts_data();
});

function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}

function make_category(data) {
  dis_category.innerText = data[0].category_name;
  for (keys in data) {
    let category_id = data[keys].category_id;
    let category_name = data[keys].category_name;
    const category_item = document.createElement("li");
    category_item.classList.add("active:bg-violet-300", "active:text-violet-500", "rounded-sm", "px-1");
    category_item.innerText = category_name;
    category_item.onclick = function() {
      change_category(category_id, category_name);
    };
    category.appendChild(category_item);
  }
}

function make_post(data) {
  posts.innerHTML = "";
  total_posts = 0;
  
  if(isTodaysPic) {
    data = data.filter(function(e) {
      return e.others_info.is_todays_pick;
    });
  }
  if(isTrending) {
    data = data.filter(function(e) {
      return e.others_info.is_trending;
    });
  }
  
  if(sort_of_view != "default") {
    data = data.sort((a, b) => {
      if(getDescendantProp(a, sort_of_view) < getDescendantProp(b, sort_of_view)) {
        return -1;
      }
      if (getDescendantProp(a, sort_of_view) > getDescendantProp(b, sort_of_view)) {
        return 1;
      }
      return 0;
    });
  }
  
  for (keys in data) {
    const post = document.createElement("article");
    post.classList.add("p-3", "rounded-md", "h-[300px]", "bg-white", "space-y-3");
    post.innerHTML = `
        <div class="flex h-3/4 space-x-3">
          <img src=${data[keys].thumbnail_url} alt="Post thumbnail" class="w-1/3 object-cover rounded-lg" />
          <div class="space-y-2">
            <p class="font-semibold h-[80px] overflow-hidden text-xl">${data[keys].title}</p>
            <p class="text-gray-400 h-[120px] text-ellipsis overflow-hidden">${data[keys].details}</p>
          </div>
        </div>
        <div class="flex items-center justify-between text-sm px-2">
          <div class="flex items-center space-x-1">
            <img src=${data[keys].image_url} alt="User profile" class="rounded-full h-8 w-8 object-cover" />
            <div>
              <p>${data[keys].author.name}</p>
              <p class="text-gray-400 w-[100px]">${data[keys].author.published_date}</p>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <i class="fa-solid fa-eye"></i>
            <p class="font-bold">${data[keys].total_view}</p>
          </div>
          <div class="flex space-x-2">
            <i class="fa-solid fa-star-half-stroke"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
          </div>
          <a href="https://openapi.programming-hero.com/api/news/${data[keys]._id}" target="_blank" class="text-violet-600 text-xl">
            <i class="fa-solid fa-arrow-right-long"></i>
          </a>
        </div>
    `;
    posts.appendChild(post);
    total_posts++;
  }
  dis_total_posts.innerText = total_posts;
}

get_posts_data();