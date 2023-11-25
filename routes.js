const express = require("express");
const router = express.Router();
let library_books = require("./json/books.json").books;


let remove_idx = -1;


router.get("/", (request, response) => {
    response.redirect("/books")
})

router.get("/books", (request, response) => {
    response.render("main", {
        books: library_books
    })
});


// books adding
router.get("/books/add", (request, response) => {
    response.render("add", {
    });
});

router.post("/books/add_action", (request, response) => {
    let new_book = {
        "id": library_books.length + 1,
        "title": request.body.title,
        "author": request.body.author,
        "date_release": request.body.date_release,
        "is_taken": false,
        "who_taken": null,
        "date_return": null
    };

    library_books.push(new_book);

    response.redirect("/books/add");
});


// books deleting
router.get("/books/delete", (request, response) => {
    response.render("delete", {
    })
});


router.post("/books/delete_action", (request, response) => {
    remove_idx = library_books.map((book) => {
        return parseInt(book.id);
    }).indexOf(parseInt(request.body.delete_id));

    if (remove_idx === -1)
    {
        response.send(`Id не существует или введен некорректно: ${request.body.delete_id}`);
    }
    else
    {
        if (request.body.agree === "Да")
        {
            library_books.splice(remove_idx, 1);
            remove_idx = -1;
        }

        response.redirect("/books/delete");
    }
})



// books take
router.post("/books/take_action", (request, response) => {
    let take_idx = library_books.map((book) => {
        return parseInt(book.id);
    }).indexOf(parseInt(request.body.take_id));
    
    if (request.body.action_type === "undo")
    {
        //response.redirect("/books/" + request.body.take_id);
    }
    else if (request.body.action_type === "take")
    {
        library_books[take_idx].is_taken = true;
        library_books[take_idx].who_taken = request.body.who_taken;
        library_books[take_idx].date_return = request.body.date_return;
    }

    response.send();
});


// books return
router.post("/books/return_action", (request, response) => {
    let return_idx = library_books.map((book) => {
        return parseInt(book.id);
    }).indexOf(parseInt(request.body.return_id));

    library_books[return_idx].who_taken = null;
    library_books[return_idx].date_return = null;
    library_books[return_idx].is_taken = false;

    response.send();
});



// books filter
router.post("/books/filter_action", (request, response) => {
    const filter_type = request.body.filter_type;
    let library_books_filtered = library_books.slice();
    switch(filter_type)
    {
        case "all":
            // nothing to do
            break;
        case "title":
            library_books_filtered.sort((a,b) => {
                if(a.title > b.title)
                {
                    return 1;
                }
                else if(a.title < b.title)
                {
                    return -1;
                }

                return 0;
            });
            break;
        case "date":
            library_books_filtered.sort((a,b) => {
                if(a.date_return > b.date_return)
                {
                    return 1;
                }
                else if(a.date_return < b.date_return)
                {
                    return -1;
                }

                return 0;
            });
            break;
        case "is_taken":
            library_books_filtered = library_books_filtered.filter((book) => !book.is_taken);
            break;
        default:
            //nothing to do
            break;
    }

    response.json(library_books_filtered);
})


// books card
router.get("/books/:book_id([0-9]{1,})", (request, response) => {
    let book_idx = library_books.map((book) => {
        return parseInt(book.id);
    }).indexOf(parseInt(request.params.book_id));

    response.render("book", {
        book: library_books[book_idx]
    });
});


// books edit
router.get("/books/:book_id([0-9]{1,})/edit", (request, response) => {
    let book_idx = library_books.map((book) => {
        return parseInt(book.id);
    }).indexOf(parseInt(request.params.book_id));
    
    let requested_book = library_books[book_idx];

    response.render("edit", {
        book: requested_book
    });
});


router.post("/books/:book_id([0-9]{1,})/edit_action", (request, response) => {
    const book_idx = library_books.map((book) => {
        return parseInt(book.id)
    }).indexOf(parseInt(request.params.book_id));

    const body = request.body;
    if (body.title)
    {
        library_books[book_idx].title = body.title;
    }

    if (body.author)
    {
        library_books[book_idx].author = body.author;
    }

    if (body.date_release)
    {
        library_books[book_idx].date_release = body.date_release;
    }

    response.redirect("/books/" + request.params.book_id);
});


// get the style from files
router.get("/src/style/:filename", (request, response) => {
    response.sendFile(__dirname + "/src/style/" + request.params.filename);
});


router.get("/src/font-awesome/css/:filename", (request, response) => {
    response.sendFile(__dirname + "/src/font-awesome/css/" + request.params.filename);
})

// for other pages
router.get("*", (request, response)=>{
    response.status(404); // Ошибка – нет такой страницы
    response.end("Page not found");
});


module.exports = router

