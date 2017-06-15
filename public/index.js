$(document).ready(() => {
  getEvents();
});

getEvents = () => {
  fetch('/api/v1/events', {
    method: 'GET'
  }).then((response) => {
    return response.json()
  }).then((json) => {
    const event = json.map((val, i) => {
     appendEvent(val.title, val.description, val.start, val.end, val.id);
    });
  }).catch((error) => {
    console.error('error: ', error);
  });
};

addEvent = (title, description, start, end) => {
   fetch('/api/v1/events', {
     method: 'POST',
     headers: {'Content-type': 'application/json'},
     body:
       JSON.stringify({ 'title': title, 'description': description, 'start': start, 'end': end })
   }).then((response) => {
     return response.json()
   }).then((json) => {
     appendEvent(json.title, json.description, json.start, json.end);
     return json
   }).catch((error) => {
     console.error('error: ', error);
   })
 };

appendEvent = (title, description, start, end, id) => {
  const $itemCard = $('ul');
  $itemCard.prepend(
    `<li data-id='${id}' class='garage-list-item ${start}'>${title}</li>`
  );
};

$('.submit').on('click', (e) => {
  e.preventDefault();
  let $title = $('.title').val();
  let $description = $('.description').val();
  let $start = $('.start').val();
  let $end = $('.end').val();
  console.log($start, $end)

  clearFields();
  appendEvent($title, $description, $start, $end);
});

clearFields = () => {
 $('.title').val('');
 $('.description').val('');
 $('.start').val('');
 $('.end').val('');
};
