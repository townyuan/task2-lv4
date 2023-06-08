

$(document).ready(function() {

  //選單開合
  $(".menu-switch").click(function (e) {
		e.preventDefault();
		$(".menu-switch").toggleClass("active");
		$(".jq-dropdown").slideToggle();
	});
  
  // 開起選單
  $('.dropdown-btn').click(function(e) {
    $('.dropdown-menu').toggleClass('show');
  });

  // 切換按鈕文字
  $('.new-to-old').click(function(e) {
    e.preventDefault();
    $('.dropdown-menu').toggleClass('show');
    $('.dropdown-btnText').text($('.new-to-old').text());
  });

  $('.old-to-new').click(function(e) {
    e.preventDefault();
    $('.dropdown-menu').toggleClass('show');
    $('.dropdown-btnText').text($('.old-to-new').text());
  });


  //常見問題
  $('.common-problem .accordion-header').click(function() {
    let content = $(this).next('.accordion-content');
    content.slideToggle();
    let icon = $(this).find('.accordion-icon');
    icon.toggleClass('rotate');
  });

  // gotop
  $('.back-to-top').click(function(){
    // 使用動畫效果返回頂部
    $('html, body').animate({scrollTop: 0}, 500);
  });

});


// =============================================================================================


// 資料串接
const apiPath = 'https://2023-engineer-camp.zeabur.app';
// const list = document.querySelector('.card-content');
// const pagination = document.querySelector('.pager');
const list = document.querySelector('#list');
const pagination = document.querySelector('#pagination');

const data = {
  type: '',
  sort: 0,
  page: 1,
  search: '',
}

let worksData = []
let pagesData = {}

function getData({ type, sort, page, search }) {
  const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${type ? `type=${type}&` : ''}${search ? `search=${search}` : ''}`
  axios.get(apiUrl)
    .then((res) => {
      worksData = res.data.ai_works.data;
      pagesData = res.data.ai_works.page;

      // console.log(worksData);
      // console.log(worksData[0].type);
      // console.log(worksData[0].title);

      renderWorks();
      renderPages();
    })
}

getData(data);

// 作品選染至畫面
function renderWorks() {
  let works = '';

  worksData.forEach((item) => {
    works += /*html*/`<div class="card">
      <div class="photo"><a href="javascript:;"><img src="${item.imageUrl}"></a></div>
      <div class="info">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
      <div class="author">
        <div class="title">AI 模型</div>
        <div class="name">${item.model}</div>
      </div>
      <div class="item">
        <a href="javascript:;">#${item.type}</a>
        <a href="${item.link}" class="share"></a>
      </div>
    </div>`
  });

  list.innerHTML = works;
}



// 切換分頁
function changePage(pagesData) {
  const pageLinks = document.querySelectorAll('a.page-link')
  let pageId = '';

  pageLinks.forEach((item) => {

    item.addEventListener('click', (e) => {
      e.preventDefault();
      pageId = e.target.dataset.page;
      data.page = Number(pageId);

      if (!pageId) {
        data.page = Number(pagesData.current_page) + 1
      }

      getData(data);
    });
  });
}


// 分頁選染至畫面
function renderPages() {
  let pageStr = '';

  for (let i = 1; i <= pagesData.total_pages; i += 1) {
    pageStr += /*html*/`<li class="page-item ${pagesData.current_page == i ? 'active' : ''}" >
      <a class="page-link ${pagesData.current_page == i ? 'disabled' : ''}" href="#"  data-page="${i}">${i}</a>
    </li>`
  };

  if (pagesData.has_next) {
    pageStr +=  /*html*/`<li class="page-item">
      <a class="page-link" href="#">
        <span class="material-icons">
          <img src="images/icons/keyboard-arrow-right.png">
        </span>
      </a>
    </li>`
  };
  pagination.innerHTML = pageStr;

  changePage(pagesData);
}



// 切換作品排序
const desc = document.querySelector('#desc');
const asc = document.querySelector('#asc');
const btnSort = document.querySelector('#btn-sort');
//  由新到舊 -> sort = 0
desc.addEventListener('click', (e) => {
  e.preventDefault();
  data.sort = 0;
  getData(data);
  btnSort.innerHTML = '由新到舊<i><img src="images/icons/keyboard-arrow-down.png"></i>';
})
//  由舊到新 -> sort = 1
asc.addEventListener('click', (e) => {
  e.preventDefault();
  data.sort = 1
  getData(data);
  btnSort.innerHTML = '由舊到新<i><img src="images/icons/keyboard-arrow-down.png"></i>';
})



// 切換作品類型
const filterBtns = document.querySelectorAll('#filter-btn a')
filterBtns.forEach((item) => {
  item.addEventListener('click', () => {
    if (item.innerText === '全部') {
      data.type = '';
    } else {
      data.type = item.innerText;
    }
    console.log(item.innerText)
    getData(data)
  })
})

// 搜尋
const search = document.querySelector('#search');
search.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    data.search = search.value
    data.page = 1
    getData(data);
  }
})


// data: [
//   {
//   create_time: 1685707291927,
//   description: "這是一部 AI 心情點唱機，隨時推薦一首歌曲給您。",
//   discordId: "Kulimusoda#2785",
//   id: "-NWvyzmx11-ZshlicBYD",
//   imageUrl: "https://storage.googleapis.com/engineer-camp-5b706.appspot.com/images/9826a5e1-7e75-467f-8c8c-0715c771d2d4.jpeg?GoogleAccessId=firebase-adminsdk-emcev%40engineer-camp-5b706.iam.gserviceaccount.com&Expires=16756675200&Signature=L9NrcBTFMHO3bHxIOC3ZG7yNpVhHs8NvNb27%2FpfrpVh6w6IveJ91Hf%2FPu9ElSnPItxrwzwSMbJryddkxvjNF1%2BwceHOPTcf2dXeQ7bwdiZVDE7pp5I685JzsXV3%2BkZ5T3szB8c8W%2FjD5MoqeTP4bqIWjkW6oxkfYMw7hLulIbqlOAQWCBBQvRfcD2j0RctFIBDdxEEieCCX88BjO7eOkiLnobv%2FSQf18VBbBffXw4X1hr1roFlndiXmfTbR6URy2eKjK98C5N1PsFw0N0wYzX4B1KoMvs7sgZGArKbXODdqIP1TlmKxHy8NpVZNsEKvsvKLMNalFMiVWAfhBdeuO2Q%3D%3D",
//   link: "https://ai-jukebox-yuch3nchen.vercel.app/",
//   model: "gpt3.5",
//   status: true,
//   title: "AI Jukebox",
//   type: "生活應用",
//   userId: "YHpZVz8UEXYx51GzQMTz9BAMO722"
//   },