export default class Search {
    constructor() {
        // sonuçlar
        this.results = [];
    }

    // api'dan arama sonuçlarını alan bir method yaz
    async fetchResults(query) {
        try {
            // aratılan terime uygun tarifleri al 
            const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${query}`)

            // gelen cevapları işle
            const data = await res.json();

            // sınıf içerisindeki değişkene datayı aktar
            this.results = data;
        } catch (err) {

        }
    }
}