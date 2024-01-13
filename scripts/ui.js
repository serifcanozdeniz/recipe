export const ele = {
    form: document.querySelector("form"),
    result_list: document.querySelector("#results"),
    recipe_area: document.querySelector("#recipe"),
}

// bildirim gönderir
export const notify = (text) => {
    Toastify({
        text,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #fbda61, #ff5acd)",
        },
    }).showToast();
}

// yükleniyor gifini ekrana basar
export const renderLoader = (outlet) => {
    outlet.innerHTML = `
    <div class="wrapper">
     <div class="three-body">
      <div class="three-body__dot"></div>
      <div class="three-body__dot"></div>
      <div class="three-body__dot"></div>
     </div>
    </div>
    `;
};

// arama sonuçlarını ekrana basar
export const renderResults = (results) => {
    // tarif dizisi içerisindeki her bir tarif için bir link oluştur v result list içerisine bu htmle leri gönder.
    ele.result_list.innerHTML = results.map((recipe) => `
    <a href="#${recipe.recipe_id}">
          <div class="img-wrapper">
            <img
              src="${recipe.image_url}"
              alt=""
            />
          </div>
          <div class="info">
            <h4>${recipe.title}</h4>
            <p>${recipe.publisher}</p>
          </div>
    </a>
    `).join("");
}