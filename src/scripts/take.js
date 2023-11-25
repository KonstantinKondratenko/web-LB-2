let dialog_elem = document.getElementById('dialog');

function take_action(action_type)
{
    if (action_type === "take")
    {
        dialog_elem.classList.add('active');
    }
    else if (action_type === "return")
    {
        processing_return();
    }
}

async function processing_take(action_type)
{
    let take_id = document.URL.split("/").slice(-1); // получаем id из URL странички!!!
    let who_taken = document.querySelector("#who_taken").value;
    let date_return = document.querySelector('#date_return').value
    dialog_elem.classList.remove('active');

    await fetch("/books/take_action", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action_type: action_type,
            take_id: take_id,
            who_taken: who_taken,
            date_return: date_return
        })
    })
    
    location.reload();
}


async function processing_return()
{
    let return_id = document.URL.split("/").slice(-1);
    await fetch("/books/return_action", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            return_id: return_id
        })
    });

    location.reload();
}