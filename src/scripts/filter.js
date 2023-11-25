const books_container = document.querySelector(".books");

function processing_filter()
{
    filter_type = document.getElementById("filter_type").value;

    fetch("/books/filter_action", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filter_type: filter_type
        })
    }).then(res => res.json()).then((library_books_filtered) => {
        //console.log(library_books_filtered);
        books_container.innerHTML = `<p class="w3-center">Список книг:</p>`;

        books_container.innerHTML += "<ul class='w3-ul w3-card-4'>" + library_books_filtered.map(
            book => `<li class="w3-hover-blue"><a href="/books/${book.id}">${book.id}. ${book.title} (автор: ${book.author}, год: ${book.date_release})` 
            +  (book.is_taken == false ? "<div>Книга в наличии</div>" : `<div>Книга забронирована на имя ${book.who_taken} до ${book.date_return}</div>`)
            + `</a></li>`
        ).join("") + "</ul>";
    })
}